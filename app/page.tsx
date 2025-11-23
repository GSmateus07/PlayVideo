'use client'; 
// Indica que este componente é um Client Component (Next.js)

import { useContext, useState } from "react";
import { HomeContext } from "./context/HomeContext";
// Importa contexto central do player

import { FaPause, FaPlay, FaBackward, FaForward, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
// Ícones usados nos controles do player

import videos, { Video } from './data/video';
// Importa a lista de vídeos e o tipo Video

import { convertTimeToString } from "./utils/Utils";
// Função utilitária que converte segundos para mm:ss

// Categoriza os vídeos por gênero (Romance / Ação)
const categorizedVideos = {
  Romance: videos.filter(video => video.category === "Romance"),
  Ação: videos.filter(video => video.category === "Ação"),
};

// Componente simples de cabeçalho
const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 text-center">
      <h1 className="text-3xl font-bold">PlayVideo</h1>
      <p className="text-sm mt-2">Bem-vindo ao PlayVideo</p>
      <p className="text-sm">Seu destino para filmes e vídeos.</p>
    </header>
  );
};

export default function Home() {
  // Controla se o filtro está ativo (canvas)
  const [showFilter, setShowFilter] = useState(true);

  // Guarda o vídeo atual para mostrar informações abaixo
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  // Importa variáveis e funções vindas do contexto
  const {
    videoURL,        // URL atual do vídeo
    playing,         // Se está tocando
    totalTime,       // Duração total
    currentTime,     // Tempo atual
    videoRef,        // Referência do vídeo HTML
    canvasRef,       // Referência do canvas (com filtros)
    playPause,       // Função play/pause
    configCurrentTime,
    configVideo,
    configFilter,
    configVolume,
    volume,
  } = useContext(HomeContext);

  // Quando um vídeo da lista é clicado
  const handleVideoClick = (index: number) => {
    configVideo(index);                // Troca o vídeo no contexto
    setCurrentVideo(videos[index]);    // Atualiza informações abaixo
    if (!playing) {
      playPause();                     // Se estava pausado, dá play
    }
  };

  // Vai para o próximo vídeo da lista
  const handleNextVideo = () => {
    const nextIndex = (videos.findIndex(video => video.videoURL === videoURL) + 1) % videos.length;
    configVideo(nextIndex);
    setCurrentVideo(videos[nextIndex]);
  };

  // Vai para o vídeo anterior
  const handlePreviousVideo = () => {
    const currentIndex = videos.findIndex(video => video.videoURL === videoURL);
    const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
    configVideo(prevIndex);
    setCurrentVideo(videos[prevIndex]);
  };

  // Alterna entre volume normal e mudo
  const toggleMute = () => {
    configVolume(volume > 0 ? 0 : 0.5);
  };

  return (
    <main className="mx-auto w-[70%] mt-2 flex flex-col">
      <Header />

      <div className="w-full mb-4">

        {/* Vídeo real (hidden se filtro estiver ativo) */}
        <video 
          className="w-full" 
          ref={videoRef} 
          src={videoURL} 
          hidden={showFilter}
        ></video>

        {/* Canvas com filtros aplicados */}
        <canvas 
          className="w-full h-[380px]" 
          ref={canvasRef} 
          hidden={!showFilter}
        ></canvas>

        {/* Controles do player */}
        <div className="bg-black mt-2 flex items-center justify-between p-2">
          
          {/* Botões de retroceder, play/pause e avançar */}
          <div className="flex items-center">
            <button className="text-white" onClick={handlePreviousVideo}>
              <FaBackward />
            </button>

            <button className="text-white mx-2" onClick={playPause}>
              {playing ? <FaPause /> : <FaPlay />}
            </button>

            <button className="text-white" onClick={handleNextVideo}>
              <FaForward />
            </button>
          </div>

          {/* Barra de progresso do vídeo */}
          <input 
            type="range"
            min={0}
            max={totalTime}
            value={currentTime}
            onChange={(e) => configCurrentTime(Number(e.target.value))}
            className="mx-2"
          />

          {/* Botão de volume com ícone dinâmico */}
          <button onClick={toggleMute} className="text-white mx-2">
            {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>

          {/* Slider de volume */}
          <input 
            type="range" 
            min={0} 
            max={1} 
            step={0.01} 
            value={volume} 
            onChange={(e) => configVolume(Number(e.target.value))}
            className="mx-2"
          />

          {/* Tempo atual / total */}
          <span className="text-white">
            {convertTimeToString(currentTime)} / {convertTimeToString(totalTime)}
          </span>

          {/* Seleção de filtro (só aparece quando showFilter = true) */}
          <select value={0} onChange={(e) => configFilter(Number(e.target.value))} hidden={!showFilter}>
            <option value={0}>Sem filtro</option>
            <option value={1}>Verde</option>
            <option value={2}>Azul</option>
          </select>

          {/* Checkbox para ativar ou desativar o filtro */}
          <input 
            type="checkbox" 
            name="Filtro" 
            className="mx-2" 
            onChange={() => setShowFilter(!showFilter)} 
          />
        </div>
      </div>

      {/* Informações do vídeo atual */}
      {currentVideo && (
        <div className="w-full mt-4 p-4 bg-gray-200 rounded-lg">
          <h3 className="text-xl font-bold">{currentVideo.name}</h3>
          <p className="text-gray-700">{currentVideo.description}</p>
        </div>
      )}

      {/* Lista de vídeos separados por categoria */}
      <div className="w-full">
        {
          Object.entries(categorizedVideos).map(([category, videosInCategory]) => (
            <div key={category} className="mb-8">
              
              {/* Nome da categoria */}
              <h2 className="text-black text-lg font-bold mb-2">{category}</h2>

              <div className="grid grid-cols-3 gap-4">
                {videosInCategory.map((video: Video) => {
                  
                  // Pega o índice absoluto no array original
                  const absoluteIndex = videos.findIndex(v => v.videoURL === video.videoURL);

                  // Verifica se é o vídeo atual
                  const isCurrentVideo = videoURL === video.videoURL;

                  // Calcula progresso para barra na miniatura
                  const progress = isCurrentVideo ? (currentTime / totalTime) * 100 : 0;

                  return (
                    <button 
                      key={video.videoURL} 
                      className="w-full relative" 
                      onClick={() => handleVideoClick(absoluteIndex)}
                    >
                      
                      {/* Nome sobreposto na miniatura */}
                      <span className="absolute top-0 left-0 w-full text-center text-white bg-black bg-opacity-70 p-1">
                        {video.name}
                      </span>

                      {/* Miniatura */}
                      <img 
                        className="w-full h-auto border-2 border-gray-300 rounded-lg object-contain" 
                        src={video.imageURL} 
                        alt={`Thumbnail of ${video.name}`} 
                      />

                      {/* Barra de progresso na miniatura */}
                      {isCurrentVideo && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300">
                          <div 
                            className="h-full bg-tomato" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        }
      </div>
    </main>
  );
}
