export type Video = {
    id: string;
    name: string;       // Add a name field to each video object
    videoURL: string;
    imageURL: string;
    category: string;  // Add a category field to each video object
    description: string;
}

const videos: Video[] = [
    {
        id: "1",
        name: "CANGAÇO NOVO",
        videoURL: "video/Cangaço novo.mp4",
        imageURL: "image/Cangaço novo.jpg",
        category: "Ação",
        description: "Sobre um bancário de São Paulo chamado Ubaldo que descobre que é herdeiro de um legado misterioso no sertão e, ao retornar para sua cidade natal, se torna um líder de uma facção de cangaceiros."
    },
    {
        id: "2",
        name: "DNA DO CRIME",
        videoURL: "video/DNA do crime.mp4",
        imageURL: "image/DNA do crime.jpg",
        category: "Ação",
        description: "Conta a história de agentes da Polícia Federal em Foz do Iguaçu que investigam um assalto milionário no Paraguai, utilizando amostras de DNA para desvendar uma complexa organização criminosa que atua na fronteira entre Brasil e Paraguai"
    },
    {
        id: "3",
        name: "UMA PAREDE ENTRE NÓS",
        videoURL: "video/Uma parede entre nos.mp4",
        imageURL: "image/Uma parede entre nos.jpg",
        category: "Romance",
        description: "Valentina é uma pianista que acaba de se mudar para um novo apartamento depois do término com o ex-namorado, e precisa praticar o tempo todo para uma audição."
    },
    {
        id: "4",
        name: "OS DONOS DO JOGO",
        videoURL: "video/Os donos do jogo.mp4",
        imageURL: "image/Os donos do jogo.jpg",
        category: "Ação",
        description: "Retrata a disputa pelo controle do jogo do bicho no Rio de Janeiro, abordando a ascensão de um novo bicheiro, as intrigas entre as famílias rivais, a influência do jogo na sociedade e a iminente legalização dos jogos de azar."
    },
    {
        id: "5",
        name: "CABRAS DA PESTE",
        videoURL: "video/Cabras da peste.mp4",
        imageURL: "image/Cabras da peste.jpg",
        category: "Ação",
        description: "Dois polícias desastrados dão um passo maior que a perna ao oporem-se a criminosos perigosos enquanto procuram Celestina, uma adorada cabra mascote."
    },
    {
        id: "6",
        name: "TRUQUE DE MESTRE O SEGUNDO ATO",
        videoURL: "video/Truque de mestre o segundo ato.mp4",
        imageURL: "image/Truque de mestre o segundo ato.jpg",
        category: "Ação",
        description: "Após enganarem o FBI, os três cavaleiros, Daniel Atlas, Merritt McKinney e Jack Wilder, estão foragidos. Eles seguem as ordens de Dylan Rhodes, que segue trabalhando no FBI de forma a impedir os avanços na procura dos próprios cavaleiros."
    },
]
export default videos;
