import { CosmicCommandHandler, Command } from "../CosmicCommandHandler";

let knockKnockJokes = [
    { q: 'Arthur', a: 'Arthur any more at home like you?' },
    { q: 'Jimmy', a: 'Jimmy a little kiss, will ya, huh?' },
    { q: 'Hyman', a: 'Hyman the mood for love' },
    { q: 'Avon', a: 'Avon to be alone' },
    { q: 'Boo', a: `Don't cry, little baby` },
    { q: 'Butcher', a: 'Butcher arms around me honey, hold me tight' },
    { q: 'Theresa', a: 'Theresa... nothing like a dame.' },
    { q: 'Dishes', a: 'Dishes the FBI. Open up.' },
    { q: 'Elba', a: 'Elba down to get you in a taxi, honey.' },
    { q: 'Accordion', a: `Accordion to the paper, it's gonna rain tonight.` },
    { q: 'Abie', a: 'Abie cdefg' },
    { q: 'Abyssinia', a: 'Abyssinia soon.' },
    { q: 'Major', a: `Major open the door, didn't I?` },
    { q: 'Evvie', a: 'Evviething I have is yours.' },
    { q: 'Manny', a: 'Manny are called but few are chosen.' },
    { q: 'Wendy', a: 'Wendy moon comes over the mountain.' },
    { q: 'Donna', a: 'Donna sit under the apple tree...' },
    { q: 'Yule', a: 'Yule never know who much I love you...' },
    { q: 'Marion', a: 'Marion haste, repent at leisure.' },
    { q: 'Minnie', a: 'Minnie brave hearts are asleep in the deep.' },
    { q: 'Mayer', a: 'Mayer days be filled with laughter.' },
    { q: 'Hugh', a: 'Yoo hoo yourself.' },
    { q: 'Hugo', a: 'Hugo to my head.' },
    { q: 'Gwen', a: 'Gwen my way?' },
    { q: 'Handsome', a: 'Handome pizza to me, please.' },
    { q: 'Humus', a: 'Humus remember this, a kiss is still a kiss...' },
    { q: 'Sony', a: 'Sony... a paper moon.' },
    { q: 'Ida', a: `Ida written if I'd known you were away.` },
    { q: 'Iowa', a: 'Iowa a lot of money on my income tax.' },
    { q: 'Isabelle', a: 'Isabelle ringing? I thought I heard one.' },
    { q: 'Jamaica', a: 'Jamaica passing grade in math?' },
    { q: 'Doughnut', a: 'Doughnut ask me silly questions.' },
    { q: 'Dr. Livingstone', a: 'Dr. Livingstone I. Presume.' },
    { q: 'Dwayne', a: `Dwayne the bathtub, I'm dwowning.`},
    { q: 'Elsie', a: 'Elsie you later, alligator.' },
    { q: 'Lil', a: 'Lil things mean a lot.' },
    { q: 'Madame', a: 'Madame foot is stuck in the door.' },
    { q: 'Leica', a: 'Leica bridge over troubled water...' },
    { q: 'Kershew', a: 'Kershew, Red Baron!' },
    { q: 'Olive', a: 'Olive my wife, but oh, you kid!' },
    { q: `O'Shea`, a: `O'Shea can you shee, by the dawn's early light?` },
    { q: 'Toby', a: 'Toby or not Toby, that is the question.' },
    { q: 'Sarah', a: 'Sarah doctor in the house?' },
    { q: 'Tuba', a: 'Tuba toothpaste, please.' },
    { q: 'Zebra', a: 'Zebra is too big for me.' },
    { q: 'Heather', a: 'Heather Georgy girl.' },
    { q: 'Ira', a: 'Ira...gret that I have but one life to give for my country.' },
    { q: 'Watson', a: 'Not much. Watson who with you?' },
    { q: 'Annie', a: 'Annie thing you can do, I can do better...' },
    { q: 'Wayne', a: 'Waynedwops keep fawing on my head.' },
    { q: 'Orange', a: `Orange you glad I didn't say banana?` },
    { q: 'Sam and Janet', a: 'Sam and Janet evening...' },
    { q: 'Thesis', a: 'Thesis... a recording.' },
    { q: 'Anita', a: 'Anita another kiss, baby.' },
    { q: 'Leif', a: 'Leif me alone.' },
    { q: 'Olaf', a: 'Olaf my heart in San Francisco.' },
    { q: 'Murray', a: 'Murray Christmas to all.' },
    { q: 'Philip', a: `Philip my glass, please. I'm thirsty.` },
    { q: 'Pizza', a: 'Pizza on earth, good will to men.' },
    { q: 'Atch', a: 'Gesundheit!' },
    { q: 'Thad', a: `Thad's all, folks!` }
];

let knockKnocking = false;
let joke: any;

CosmicCommandHandler.registerCommand(new Command(
    'knockknockjoke',
    [ 'knockknockjoke', 'kkj' ],
    '%PREFIX%knockknockjoke',
    `Tons of bad knock knock jokes.`,
    [ 'default' ],
    false,
    'fun',
    async (msg, cl) => {
        if (knockKnocking) {
            // cl.client.off('a', listener1);
            // cl.client.off('a', listener2);
            // knockKnocking = false;

            return `There is already a knock knock joke in progress: ${joke.q}`;
        }

        
        let listener2 = function(msg) {
            if (msg.a.toLowerCase().endsWith('who') || msg.a.toLowerCase().endsWith('who?')) {
                cl.sendChat(joke.a);
                cl.client.off('a', listener2);
                knockKnocking = false;
            }
        }
        
        let listener1 = function(msg) {
            if (msg.a.toLowerCase() == `who's there` || msg.a.toLowerCase() == 'whos there' || msg.a.toLowerCase() == `who's there?` || msg.a.toLowerCase() == 'whos there?') {
                cl.sendChat(joke.q);
                cl.client.off('a', listener1);
                cl.client.on('a', listener2);
            }
        }

        knockKnocking = true;
        cl.sendChat('Knock knock');
        joke = knockKnockJokes[Math.floor(Math.random() * knockKnockJokes.length)];
        cl.client.on('a', listener1);
    }
));
