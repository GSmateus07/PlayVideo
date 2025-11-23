'use client';
// Indica que este componente roda no cliente (Next.js)

import { ReactNode, RefObject, createContext, useEffect, useRef, useState } from "react";
import videos, { Video } from "../data/video";
import { Filter, filters } from "../data/Filter";

// Tipos que o contexto disponibiliza para os componentes
type HomeContextData = {
    videoURL: string;                               // URL do vídeo atual
    playing: boolean;                               // Se o vídeo está tocando
    totalTime: number;                              // Tempo total do vídeo
    currentTime: number;                            // Tempo atual
    volume: number;                                 // Volume atual (0 a 1)
    videoRef: RefObject<HTMLVideoElement>;          // Referência ao elemento <video>
    canvasRef: RefObject<HTMLCanvasElement>;        // Referência ao <canvas> (com filtros)
    playPause: () => void;                          // Função play/pause
    configCurrentTime: (time: number) => void;      // Ajusta o tempo atual
    configVolume: (volume: number) => void;         // Ajusta volume
    configVideo: (index: number) => void;           // Troca o vídeo
    configFilter: (index: number) => void;          // Troca filtro
    groupVideosByCategory: (videos: Video[]) => Record<string, Video[]>; // Agrupa vídeos por categoria
}

// Criação do contexto
export const HomeContext = createContext({} as HomeContextData);

type ProviderProps = {
    children: ReactNode;    
}

const HomeContextProvider = ({ children }: ProviderProps) => {

    // Estados do player
    const [videoURL, setVideoURL] = useState("");
    const [videoIndex, setVideoIndex] = useState(0);
    const [filterIndex, setFilterIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1); // Volume inicial = 100%

    // Referências ao vídeo e ao canvas
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Quando o app carrega, seta o vídeo inicial
    useEffect(() => {
        configVideo(videoIndex);
    }, []);

    // Configura o vídeo baseado no índice
    const configVideo = (index: number) => {
        const currentIndex = index % videos.length;     // Garante ciclo infinito
        const currentVideo: Video = videos[currentIndex];
        setVideoURL(currentVideo.videoURL);             // Define URL do vídeo
        setVideoIndex(currentIndex);                    // Atualiza índice atual
    }
    
    // Troca o filtro aplicado
    const configFilter = (index: number) => {
        setFilterIndex(index);
    }

    // Agrupa vídeos por categoria automaticamente
    const groupVideosByCategory = (videos: Video[]) => {
        return videos.reduce((acc, video) => {
            if (!acc[video.category]) {
                acc[video.category] = [];
            }
            acc[video.category].push(video);
            return acc;
        }, {} as Record<string, Video[]>);
    };

    // Monitora mudanças no vídeo, filtro ou volume
    useEffect(() => {
        const video = videoRef.current;
        if (video) {

            // Quando os metadados carregam (ex: duração)
            video.onloadedmetadata = () => {
                setTotalTime(video.duration);          // Armazena duração total
                setCurrentTime(video.currentTime);     // Tempo inicial do vídeo
                if (playing) video.play();             // Se estava tocando, continua após troca
            };

            // Atualiza o tempo atual a cada frame
            video.ontimeupdate = () => {
                setCurrentTime(video.currentTime);
            };

            // Passa para o próximo vídeo ao terminar
            video.onended = () => {
                configVideo(videoIndex + 1);
            };

            video.volume = volume; // Sempre aplica o volume atual
            draw();                // Mantém o canvas sincronizado
        }
    }, [videoURL, filterIndex, volume]);

    // Permite alterar o tempo de execução (seek)
    const configCurrentTime = (time: number) => {
        const video = videoRef.current;
        if (video) {
            video.currentTime = time;
            setCurrentTime(time);
        }
    }

    // Ajusta o volume tanto no player quanto no estado
    const configVolume = (newVolume: number) => {
        const video = videoRef.current;
        if (video) {
            video.volume = newVolume;
            setVolume(newVolume);
        }
    }

    // Reproduz ou pausa o vídeo
    const playPause = () => {
        const video = videoRef.current;
        if (!video) return;

        if (playing)
            video.pause();
        else {
            video.play();
            draw(); // Inicia atualização do canvas ao dar play
        }
        setPlaying(!playing);
    }

    // Desenha o vídeo no canvas e aplica filtro
    const draw = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        // Desenha o frame atual do vídeo no canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Captura os pixels da imagem
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const filter: Filter = filters[filterIndex];

        // Aplica efeito pixel por pixel
        for (let i = 0; i < data.length; i += 4) {
            const green = data[i + 1];
            const blue = data[i + 2];

            filter.calc(green, blue);   // Calcula valores do filtro

            data[i + 1] = filter.green; // Modifica pixel verde
            data[i + 2] = filter.blue;  // Modifica pixel azul
        }

        context.putImageData(imageData, 0, 0);

        // Continua animando enquanto o vídeo estiver tocando
        if (playing) requestAnimationFrame(draw);
    }

    return (
        <HomeContext.Provider value={{
            videoURL,
            playing,
            totalTime,
            currentTime,
            volume,
            videoRef,
            canvasRef,
            playPause,
            configCurrentTime,
            configVolume,
            configVideo,
            configFilter,
            groupVideosByCategory
        }}>
            {children}
        </HomeContext.Provider>
    );
}

export default HomeContextProvider;
