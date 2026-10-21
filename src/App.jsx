import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc3, Music2, Play, Pause, MapPin, ArrowUpRight, MoveHorizontal, Heart, Volume2, Phone, MessageCircle, Instagram, Facebook } from "lucide-react";
import { CONFIG } from "./config";
import guests from "./guests.json";

function Vinyl({ playing }) {
  return (
    <div className={`vinyl ${playing ? "is-playing" : ""}`} aria-label="Đĩa than">
      <div className="vinyl-grooves" />
      <div className="vinyl-label">
        <span className="label-top">LTDEE · SIDE A</span>
        <Disc3 size={27} strokeWidth={1.2} />
        <span className="label-bottom">GRADUATION</span>
      </div>
    </div>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [musicError, setMusicError] = useState("");
  const invitationRef = useRef(null);
  const audioRef = useRef(null);
  const slug = decodeURIComponent(window.location.pathname.split("/").filter(Boolean).pop() || "");
  const guestName = slug ? (guests[slug] || "") : CONFIG.guestName;
  const unknownGuestSlug = Boolean(slug && !guests[slug]);

  const toggleMusic = async () => {
    setMusicError("");
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setMusicError("Không thể tự phát nhạc. Hãy nhấn Play để thử lại.");
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const openAlbum = () => {
    setOpen(true);
    const audio = audioRef.current;
    if (audio) {
      audio.play().then(() => setPlaying(true)).catch(() => {
        setPlaying(false);
        setMusicError("Trình duyệt chưa cho phép tự phát nhạc. Hãy nhấn PLAY TRACK.");
      });
    }
    window.setTimeout(() => {
      invitationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 550);
  };

  const onDragEnd = (_, info) => {
    if (info.offset.x > 55 || info.velocity.x > 350) openAlbum();
    if (info.offset.x < -55 || info.velocity.x < -350) {
      setOpen(false);
      setPlaying(false);
      audioRef.current?.pause();
    }
  };

  return (
    <main className="page-shell">
      <div className="grain" aria-hidden="true" />
      <audio ref={audioRef} src={CONFIG.musicUrl} preload="auto" loop />
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Về đầu trang">
          <span className="wordmark-disc"><Disc3 size={19} /></span>
          <span>INDEPENDENT RELEASE<br /><b>LTDEE · 2026</b></span>
        </a>
        <span className="topbar-note">A PERSONAL INVITATION</span>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> CLASS OF 2026 · LIMITED EDITION</p>
          <h1>THE<br /><em>GRADUATION</em><br />MIXTAPE<span className="period">.</span></h1>
          <p className="hero-subtitle">One chapter ends.<br />Another one sounds like us.</p>
          <div className="hero-meta">
            <span>WRITTEN BY LIFE</span><span>PRODUCED BY TIME</span><span>RELEASE NO. 001</span>
          </div>
        </div>

        <div className="record-stage">
          <div className="stage-caption stage-caption-left">SIDE A<br /><span>THE NEXT CHAPTER</span></div>
          <div className="album-scene">
            <motion.div
              className={`vinyl-dragger ${open ? "is-out" : ""}`}
              drag="x"
              dragConstraints={{ left: open ? -5 : 0, right: open ? 0 : 125 }}
              dragElastic={0.08}
              dragMomentum={false}
              onDragEnd={onDragEnd}
              whileDrag={{ cursor: "grabbing", scale: 1.015 }}
              animate={{ x: open ? 112 : 0, rotate: open && playing ? 0 : 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
              role="button"
              tabIndex={0}
              aria-label={open ? "Kéo đĩa về bìa" : "Kéo đĩa than ra khỏi bìa"}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (open) { setOpen(false); setPlaying(false); } else { openAlbum(); } }
              }}
            >
              <Vinyl playing={playing} />
            </motion.div>
            <motion.div
              className="album-sleeve"
              animate={{ x: open ? -18 : 0, rotate: open ? -2 : 0 }}
              transition={{ type: "spring", stiffness: 170, damping: 22 }}
            >
              <div className="sleeve-topline"><span>LTDEE</span><span>2026 / 1st</span></div>
              <div className="portrait-frame">
                <img src={CONFIG.portraitPath} alt="Vị trí ảnh chân dung artwork của LTDee" />
                <div className="portrait-overlay">
                  <span>THE</span><strong>GRADUATION</strong><span>MIXTAPE</span>
                </div>
              </div>
              <div className="sleeve-bottom">
                <div><span className="tiny-label">AN INVITATION TO</span><strong>THE NEXT CHAPTER</strong></div>
                <Disc3 size={30} strokeWidth={1.1} />
              </div>
            </motion.div>
          </div>
          <div className="stage-caption stage-caption-right">
            <MoveHorizontal size={16} />
            <span>{open ? "PLAYING · PLEASE ENJOY!" : "KÉO ĐĨA SANG PHẢI ĐỂ MỞ THIỆP"}</span>
          </div>
        </div>
      </section>

      <section className="player-strip" aria-label="Trình phát nhạc">
        <div className="player-track">
          <div className="player-icon"><Music2 size={18} /></div>
          <div className="track-copy"><span className="tiny-label">NOW SPINNING · LTDEE</span><strong>{CONFIG.musicTitle}</strong></div>
        </div>
        <div className="player-controls">
          <span className="sound-note"><Volume2 size={15} /> MP3 PLAYER · ĐỪNG NÊN NHỚ</span>
          <button className="play-button" onClick={toggleMusic} aria-label={playing ? "Tạm dừng nhạc" : "Phát nhạc"}>
            {playing ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
            <span>{playing ? "PAUSE TRACK" : "PLAY TRACK"}</span>
          </button>
        </div>
        {musicError && <p className="music-error" role="status">{musicError}</p>}
      </section>

      <AnimatePresence>
        {open && (
          <motion.section
            ref={invitationRef}
            className="invitation"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.45 }}
          >
            <div className="invitation-heading">
              <p className="eyebrow"><span className="eyebrow-line" /> TRACK 01 · THE CEREMONY</p>
              <h2>YOU’RE ON<br /><em>THE LIST.</em></h2>
              <p className="invitation-intro">Một cột mốc sẽ trọn vẹn hơn khi có những người đã đồng hành cùng mình.</p>
            </div>
            <div className="event-card">
              <div className="event-card-top"><span>PERSONAL INVITATION</span><Heart size={17} /></div>
              <p className="tiny-label guest-label">THÂN MỜI</p>
              <h3 className={`guest-name ${guestName ? "" : "guest-name-empty"}`}>{guestName || (unknownGuestSlug ? "Chưa có tên khách mời" : "")}</h3>
              {unknownGuestSlug && <p className="guest-link-warning">Link này chưa có tên khách mời trong dữ liệu. Hãy kiểm tra lại danh sách và tạo link.</p>}
              <p className="host-line">Đến chung vui cùng <strong>{CONFIG.artist}</strong><br /><span>aka {CONFIG.aka}</span></p>
              <div className="event-divider" />
              <p className="tiny-label">THE GRADUATION CEREMONY</p>
              <p className="school-name">{CONFIG.school}</p>
              <div className="event-details">
                <div><span className="tiny-label">DATE</span><strong>{CONFIG.date}</strong></div>
                <div><span className="tiny-label">TIME</span><strong>{CONFIG.time}</strong></div>
              </div>
              <div className="venue-row"><MapPin size={19} /><span>{CONFIG.venue}</span></div>
              <a className="maps-link" href={CONFIG.mapsUrl} target="_blank" rel="noreferrer">
                OPEN IN MAPS <ArrowUpRight size={16} />
              </a>
              <section className="attendance-notes" aria-labelledby="attendance-notes-title">
                <div className="attendance-notes-heading">
                  <span className="tiny-label">BEFORE YOU ARRIVE</span>
                  <h4 id="attendance-notes-title">Lưu ý khi đến tham dự</h4>
                  <p>Một vài điều nhỏ để buổi lễ diễn ra thuận lợi nhé.</p>
                </div>
                <div className="note-item">
                  <span className="note-number">01</span>
                  <div><strong>Giấy tờ tùy thân</strong><span>Mang theo CCCD hoặc thẻ sinh viên để xuất trình khi cần tại cổng.</span></div>
                </div>
                <div className="note-item">
                  <span className="note-number">02</span>
                  <div><strong>Mã số sinh viên</strong><span>MSSV: <b>52200044</b>. Bạn có thể ghi nhớ mã số này để cung cấp khi được yêu cầu.</span></div>
                </div>
                <div className="note-item">
                  <span className="note-number">03</span>
                  <div><strong>Bảo vệ tài sản cá nhân</strong><span>Hạn chế mang theo đồ có giá trị và chú ý tư trang tại khu vực đông người.</span></div>
                </div>
              </section>
              <div className="contact-section">
                <p className="tiny-label">KEEP IN TOUCH · LIÊN HỆ</p>
                <a href="tel:0384449241"><Phone size={15} /> <span>Phone</span><strong>0384 449 241</strong></a>
                <a href="https://zalo.me/0369810269" target="_blank" rel="noreferrer"><MessageCircle size={15} /> <span>Zalo</span><strong>0369 810 269</strong></a>
                <a href="https://www.facebook.com/eoti.dee269" target="_blank" rel="noreferrer"><Facebook size={15} /> <span>Facebook</span><strong>@eoti.dee269</strong><ArrowUpRight size={13} /></a>
                <a href="https://www.instagram.com/sp.lil_tdee/" target="_blank" rel="noreferrer"><Instagram size={15} /> <span>Instagram</span><strong>@sp.lil_tdee</strong><ArrowUpRight size={13} /></a>
              </div>
              <p className="closing-note">THANK YOU FOR BEING PART OF MY STORY.</p>
            </div>
            <p className="invitation-footnote">NO RSVP FORM YET · JUST BRING YOUR GOOD ENERGY.</p>
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="footer">
        <span>DESIGNED AS A MEMORY · NOT JUST AN INVITATION</span>
        <span>WITH LOVE, {CONFIG.aka.toUpperCase()} <Heart size={12} fill="currentColor" /></span>
      </footer>
    </main>
  );
}
