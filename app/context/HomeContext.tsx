'use client';

import { ReactNode, RefObject, createContext, useEffect, useRef, useState } from "react";
import videos, { Video } from "../data/video";
import { Filter, filters } from "../data/Filter";

// Tipos de dados que o contexto do Home vai fornecer
type HomeContextData = {
    videoURL: string;
    playing: boolean;
    totalTime: number; // Mantendo o totalTime
    currentTime: number;
    volume: number;
    videoRef: RefObject<HTMLVideoElement>;
    canvasRef: RefObject<HTMLCanvasElement>;
    playPause: () => void;
    configCurrentTime: (time: number) => void;
    configVolume: (volume: number) => void;
    configVideo: (index: number) => void;
    configFilter: (index: number) => void;
    groupVideosByCategory: (videos: Video[]) => Record<string, Video[]>;
}

// Criação do contexto com os dados tipados
export const HomeContext = createContext({} as HomeContextData);

type ProviderProps = {
    children: ReactNode;    
}

const HomeContextProvider = ({ children }: ProviderProps) => {
    const [videoURL, setVideoURL] = useState("");
    const [videoIndex, setVideoIndex] = useState(0);
    const [filterIndex, setFilterIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [totalTime, setTotalTime] = useState(0); // volume inicial em 100%
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1); 
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        configVideo(videoIndex);
    }, []);

    const configVideo = (index: number) => {
        const currentIndex = index % videos.length;
        const currentVideo: Video = videos[currentIndex];
        setVideoURL(currentVideo.videoURL);
        setVideoIndex(currentIndex);
    }
    
    const configFilter = (index: number) => {
        setFilterIndex(index);
    }

    const groupVideosByCategory = (videos: Video[]) => {
        return videos.reduce((acc, video) => {
            if (!acc[video.category]) {
                acc[video.category] = [];
            }
            acc[video.category].push(video);
            return acc;
        }, {} as Record<string, Video[]>);
    };

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.onloadedmetadata = () => {
                setTotalTime(video.duration); // Configurando o totalTime
                setCurrentTime(video.currentTime);
                if (playing) video.play();
            };

            video.ontimeupdate = () => {
                setCurrentTime(video.currentTime);
            };

            video.onended = () => {
                configVideo(videoIndex + 1);
            };
            video.volume = volume; // Aplica o volume atual ao vídeo
            draw(); // Chama a função de desenho apenas uma vez na inicialização
        }
    }, [videoURL, filterIndex, volume]); // Inclui o volume como dependência

    const configCurrentTime = (time: number) => {
        const video = videoRef.current;
        if (video) {
            video.currentTime = time;
            setCurrentTime(time);
        }
    }

    const configVolume = (newVolume: number) => {
        const video = videoRef.current;
        if (video) {
            video.volume = newVolume;
            setVolume(newVolume);
        }
    }

    const playPause = () => {
        const video = videoRef.current;
        if (!video) return;

        if (playing) video.pause();
        else {
            video.play();
            draw(); // Chama a função de desenho ao reproduzir
        }
        setPlaying(!playing);
    }

    const draw = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const filter: Filter = filters[filterIndex];

        for (let i = 0; i < data.length; i += 4) {
            const green = data[i + 1];
            const blue = data[i + 2];
            filter.calc(green, blue);
            data[i + 1] = filter.green;
            data[i + 2] = filter.blue;
        }

        context.putImageData(imageData, 0, 0);
        if (playing) requestAnimationFrame(draw); // Chama a animação apenas se o vídeo estiver tocando
    }

    return (
        <HomeContext.Provider value={{
            videoURL,
            playing,
            totalTime, // Retornando totalTime
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
