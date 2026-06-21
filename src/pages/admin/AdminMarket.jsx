import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/PageShell.jsx';
import Sparkline from '../../components/market/Sparkline.jsx';
import {
  subscribeSongs,
  subscribeArtists,
  createSong,
  updateSong,
  deleteSong,
  createArtist,
  updateArtist,
  recordDailyStreams,
  refreshYouTubeForSong,
  formatNum,
} from '../../lib/market.js';

export default function AdminMarket() {
  const [tab, setTab] = useState('songs');
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [editing, setEditing] = useState(null);
  const [streamModal, setStreamModal] = useState(null);

  useEffect(() => {
    const u1 = subscribeSongs(setSongs);
    const u2 = subscribeArtists(setArtists);
    return () => { u1(); u2(); };
  }, []);

  function newSong() {
    setEditing({
      kind: 'song',
      data: { title: '', ticker: '', artistId: '', artistName: '', artistTicker: '', coverURL: '', totalStreams: 0, streamsToday: 0, change7d: 0, change30d: 0, genre: '', releaseDate: '', featured: false },
    });
  }

  function newArtist() {
    setEditing({
      kind: 'artist',
      data: { name: '', ticker: '', monthlyListeners: 0, totalStreams: 0, fanGrowthPct: 0, trendScore: 0, photoURL: '', bio: '' },
    });
  }

  async function saveEditing() {
    const { kind, id, data } = editing;
    if (kind === 'song') {
      const artist = artists.find((a) => a.id === data.artistId);
      const enriched = {
        ...data,
        artistName: artist?.name || data.artistName,
        artistTicker: artist?.ticker || data.artistTicker,
      };
      if (id) await updateSong(id, enriched);
      else await createSong(enriched);
    } else {
      if (id) await updateArtist(id, data);
      else await createArtist(data);
    }
    setEditing(null);
  }

  async function onDeleteSong(id) {
    if (!confirm('Delete this song?')) return;
    await deleteSong(id);
  }

  async function saveStreams() {
    const { songId, date, streams } = streamModal;
    const today = new Date(date);
    const iso = today.toISOString().slice(0, 10);
    const song = songs.find((s) => s.id === songId);
    await recordDailyStreams(songId, iso, streams);
    const added = Number(streams) - Number(song?.streamsToday || 0);
    await updateSong(songId, {
      streamsToday: Number(streams),
      totalStreams: Number(song?.totalStreams || 0) + Math.max(0, added),
    });
    setStreamModal(null);
  }

  return (
    <PageShell eyebrow="Admin / Market" title="Culture Stock Exchange." kicker="Manage songs, artists, and streaming data.">
      <div className="border-b border-ink/10 pb-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          <TabBtn active={tab === 'songs'} onClick={() => setTab('songs')}>Songs · {songs.length}</TabBtn>
          <TabBtn active={tab === 'artists'} onClick={() => setTab('artists')}>Artists · {artists.length}</TabBtn>
        </div>
        <div className="flex gap-2">
          <button onClick={newArtist} className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-ink hover:text-bone">+ Artist</button>
          <button onClick={newSong} className="btn-primary">+ Song →</button>
        </div>
      </div>

      {tab === 'songs' ? (
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10">
              <Th>Ticker</Th><Th>Title</Th><Th>Artist</Th><Th>Chart</Th><Th className="text-right">Total</Th><Th className="text-right">Today</Th><Th className="text-right">7d %</Th><Th></Th>
            </tr>
          </thead>
          <tbody>
            {songs.map((s) => (
              <tr key={s.id} className="border-b border-ink/5">
                <Td><span className="font-mono font-bold">${s.ticker}</span></Td>
                <Td className="truncate max-w-[14rem]">{s.title}</Td>
                <Td className="text-ash">{s.artistName}</Td>
                <Td><Sparkline songId={s.id} /></Td>
                <Td className="text-right tabular-nums">{formatNum(s.totalStreams)}</Td>
                <Td className="text-right tabular-nums">{formatNum(s.streamsToday)}</Td>
                <Td className="text-right tabular-nums">{(s.change7d || 0).toFixed(1)}%</Td>
                <Td className="text-right">
                  <Link to={`/market/song/${s.ticker}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline mr-3">
                    View ↗
                  </Link>
                  {s.youtubeVideoId && (
                    <button
                      onClick={async () => {
                        try {
                          const v = await refreshYouTubeForSong(s);
                          alert(`✓ YouTube views updated: ${v}`);
                        } catch (e) {
                          alert(`YouTube refresh failed: ${e.message}`);
                        }
                      }}
                      className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-600 hover:underline mr-3"
                    >
                      YT ⟳
                    </button>
                  )}
                  <button onClick={() => setStreamModal({ songId: s.id, date: new Date().toISOString().slice(0, 10), streams: s.streamsToday || 0 })} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline mr-3">Streams</button>
                  <button onClick={() => setEditing({ kind: 'song', id: s.id, data: { ...s } })} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline mr-3">Edit</button>
                  <button onClick={() => onDeleteSong(s.id)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-red-600">Delete</button>
                </Td>
              </tr>
            ))}
            {songs.length === 0 && (
              <tr><td colSpan={8} className="py-6 text-ink/60">No songs yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      ) : (
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10">
              <Th>Ticker</Th><Th>Name</Th><Th className="text-right">Monthly</Th><Th className="text-right">Total</Th><Th className="text-right">Growth</Th><Th></Th>
            </tr>
          </thead>
          <tbody>
            {artists.map((a) => (
              <tr key={a.id} className="border-b border-ink/5">
                <Td><span className="font-mono font-bold">${a.ticker}</span></Td>
                <Td>{a.name}</Td>
                <Td className="text-right tabular-nums">{formatNum(a.monthlyListeners)}</Td>
                <Td className="text-right tabular-nums">{formatNum(a.totalStreams)}</Td>
                <Td className="text-right tabular-nums">{(a.fanGrowthPct || 0).toFixed(1)}%</Td>
                <Td className="text-right">
                  <button onClick={() => setEditing({ kind: 'artist', id: a.id, data: { ...a } })} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:underline">Edit</button>
                </Td>
              </tr>
            ))}
            {artists.length === 0 && (
              <tr><td colSpan={6} className="py-6 text-ink/60">No artists yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      )}

      {editing && (
        <Modal title={`${editing.id ? 'Edit' : 'New'} ${editing.kind}`} onClose={() => setEditing(null)} onSave={saveEditing}>
          {editing.kind === 'song' ? (
            <>
              <Input label="Title" v={editing.data.title} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, title: v } }))} />
              <Input label="Ticker (e.g. GENZ)" v={editing.data.ticker} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, ticker: v.toUpperCase() } }))} />
              <div>
                <label className="field-label">Artist</label>
                <select className="field" value={editing.data.artistId} onChange={(e) => setEditing((s) => ({ ...s, data: { ...s.data, artistId: e.target.value } }))}>
                  <option value="">— Pick artist —</option>
                  {artists.map((a) => <option key={a.id} value={a.id}>{a.name} (${a.ticker})</option>)}
                </select>
              </div>
              <Input label="Cover image URL" v={editing.data.coverURL} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, coverURL: v } }))} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Total Streams" type="number" v={editing.data.totalStreams} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, totalStreams: v } }))} />
                <Input label="Today" type="number" v={editing.data.streamsToday} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, streamsToday: v } }))} />
                <Input label="7-day %" type="number" v={editing.data.change7d} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, change7d: v } }))} />
                <Input label="30-day %" type="number" v={editing.data.change30d} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, change30d: v } }))} />
              </div>
              <Input label="Genre" v={editing.data.genre} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, genre: v } }))} />
              <Input label="Release Date (YYYY-MM-DD)" v={editing.data.releaseDate} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, releaseDate: v } }))} />

              <div className="border-t border-ink/10 pt-4">
                <p className="eyebrow">Streaming links</p>
              </div>
              <Input label="Spotify URL" v={editing.data.spotifyURL} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, spotifyURL: v } }))} />
              <Input label="Apple Music URL" v={editing.data.appleMusicURL} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, appleMusicURL: v } }))} />
              <Input label="YouTube URL" v={editing.data.youtubeURL} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, youtubeURL: v } }))} />
              <Input label="YouTube Video ID (for YT ⟳ refresh)" v={editing.data.youtubeVideoId} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, youtubeVideoId: v } }))} />
              <Input label="SoundCloud URL" v={editing.data.soundcloudURL} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, soundcloudURL: v } }))} />
              <Input label="Audiomack URL" v={editing.data.audiomackURL} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, audiomackURL: v } }))} />

              <div className="grid grid-cols-2 gap-3 border-t border-ink/10 pt-4">
                <Input label="Spotify Streams" type="number" v={editing.data.spotifyStreams} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, spotifyStreams: v } }))} />
                <Input label="Apple Streams" type="number" v={editing.data.appleStreams} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, appleStreams: v } }))} />
                <Input label="YouTube Views" type="number" v={editing.data.youtubeViews} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, youtubeViews: v } }))} />
                <Input label="SoundCloud Plays" type="number" v={editing.data.soundcloudPlays} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, soundcloudPlays: v } }))} />
              </div>

              <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] pt-4 border-t border-ink/10">
                <input type="checkbox" checked={!!editing.data.featured} onChange={(e) => setEditing((s) => ({ ...s, data: { ...s.data, featured: e.target.checked } }))} />
                Direct2Culture Pick (featured)
              </label>
            </>
          ) : (
            <>
              <Input label="Artist Name" v={editing.data.name} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, name: v } }))} />
              <Input label="Ticker (e.g. CSHDN)" v={editing.data.ticker} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, ticker: v.toUpperCase() } }))} />
              <Input label="Photo URL" v={editing.data.photoURL} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, photoURL: v } }))} />
              <div>
                <label className="field-label">Bio</label>
                <textarea className="field min-h-[80px]" value={editing.data.bio} onChange={(e) => setEditing((s) => ({ ...s, data: { ...s.data, bio: e.target.value } }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Monthly Listeners" type="number" v={editing.data.monthlyListeners} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, monthlyListeners: v } }))} />
                <Input label="Total Streams" type="number" v={editing.data.totalStreams} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, totalStreams: v } }))} />
                <Input label="Fan Growth %" type="number" v={editing.data.fanGrowthPct} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, fanGrowthPct: v } }))} />
                <Input label="Trend Score" type="number" v={editing.data.trendScore} on={(v) => setEditing((e) => ({ ...e, data: { ...e.data, trendScore: v } }))} />
              </div>
            </>
          )}
        </Modal>
      )}

      {streamModal && (
        <Modal title="Log daily streams" onClose={() => setStreamModal(null)} onSave={saveStreams}>
          <Input label="Date (YYYY-MM-DD)" v={streamModal.date} on={(v) => setStreamModal((s) => ({ ...s, date: v }))} />
          <Input label="Streams that day" type="number" v={streamModal.streams} on={(v) => setStreamModal((s) => ({ ...s, streams: v }))} />
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Updates the song&apos;s streamsToday + adds delta to totalStreams + writes a streamHistory point.</p>
        </Modal>
      )}
    </PageShell>
  );
}

function TabBtn({ active, children, onClick }) {
  return (
    <button onClick={onClick} className={`border-b-2 pb-2 px-1 font-mono text-[10px] uppercase tracking-[0.25em] ${active ? 'border-ink text-ink' : 'border-transparent text-ash hover:text-ink'}`}>
      {children}
    </button>
  );
}

function Th({ children, className = '' }) {
  return <th className={`font-mono text-[10px] uppercase tracking-[0.25em] text-ash py-3 pr-3 text-left ${className}`}>{children}</th>;
}
function Td({ children, className = '' }) {
  return <td className={`py-3 pr-3 align-middle ${className}`}>{children}</td>;
}
function Input({ label, v, on, type = 'text' }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input type={type} className="field" value={v ?? ''} onChange={(e) => on(type === 'number' ? Number(e.target.value) : e.target.value)} />
    </div>
  );
}
function Modal({ title, onClose, onSave, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
      <div className="w-full max-w-lg bg-bone border border-ink/10 p-6 max-h-[85vh] overflow-y-auto">
        <h3 className="font-sans text-2xl font-black tracking-tight">{title}</h3>
        <div className="mt-5 space-y-4">{children}</div>
        <div className="mt-6 flex items-center justify-between gap-3">
          <button onClick={onClose} className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash hover:text-ink">Cancel</button>
          <button onClick={onSave} className="btn-primary">Save →</button>
        </div>
      </div>
    </div>
  );
}
