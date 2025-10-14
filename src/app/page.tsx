"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";

type Track = {
  src: string;
  img: string;
  name: string;
};

const playlist: Track[] = [
  { src: "/tiregrito.mp3", img: "/tiregrito.jpg", name: "Ponta Firme - Tiregrito" },
  { src: "/fire.mp3", img: "/edinaldo.jpg", name: "Edinaldo (O Grande) Pereira" },
  { src: "/ameaca.mp3", img: "/picapau.jpg", name: "Des - Mantelo" },
];

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [volume, setVolume] = useState(0.5);

  const track = playlist[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      setVolume(0.5);
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(formatTime(audio.currentTime));
        setDuration(formatTime(audio.duration));
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    return () => audio.removeEventListener("timeupdate", updateTime);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const loadTrack = (index: number) => {
    setCurrentIndex(index);
    const audio = audioRef.current;
    if (audio) {
      audio.src = playlist[index].src;
      audio.load();
      play();
    }
  };

  const play = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    isPlaying ? pause() : play();
  };

  const handlePrev = () => {
    loadTrack((currentIndex - 1 + playlist.length) % playlist.length);
  };

  const handleNext = () => {
    loadTrack((currentIndex + 1) % playlist.length);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      const newTime = (parseFloat(e.target.value) / 100) * audio.duration;
      audio.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-[#212121] text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.87), rgba(0,0,0,0.6)), url(${track.img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <section className="bg-[#2c2c2c] p-8 rounded-xl max-w-sm w-full flex flex-col gap-6 shadow-lg">
        <figure>
          <img
            src={track.img}
            alt={track.name}
            className="w-72 h-72 md:w-60 md:h-60 mx-auto rounded-lg shadow-lg opacity-80"
          />
        </figure>

        <h2 className="text-lg font-semibold text-center">{track.name}</h2>

        <input
          type="range"
          value={progress}
          min="0"
          max="100"
          onChange={handleSeek}
          className="w-full accent-red-500"
        />

        <div className="flex justify-between text-sm text-gray-400">
          <span>{currentTime}</span>
          <span>{duration}</span>
        </div>

        <div className="flex justify-around items-center mt-2">
          <button onClick={handlePrev} className="hover:scale-125 transition-transform">
            <SkipBack size={28} />
          </button>

          <button
            onClick={togglePlay}
            className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>

          <button onClick={handleNext} className="hover:scale-125 transition-transform">
            <SkipForward size={28} />
          </button>

        </div>

        <div className="flex items-center gap-3 mt-4">
          <Volume2 size={20} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 accent-red-500"
          />
          <span className="text-sm text-gray-300">{(volume * 100).toFixed(0)}%</span>
        </div>

        <audio ref={audioRef}>
          <source src={track.src} type="audio/mpeg" />
        </audio>
      </section>
    </main>
  );
}
