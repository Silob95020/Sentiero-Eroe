import React, { useState, useMemo, useEffect } from "react";

/* ============================= DATI DI GIOCO (Manuale del Giocatore 2024) ============================= */

const ABILITIES = [
  { key: "for", nome: "Forza", spiega: "Potenza fisica: attacchi in mischia, sollevare e spingere pesi." },
  { key: "des", nome: "Destrezza", spiega: "Agilità e riflessi: schivare, colpire da lontano, muoversi in silenzio." },
  { key: "cos", nome: "Costituzione", spiega: "Salute e resistenza: quanti punti ferita hai e quanto reggi lo sforzo." },
  { key: "int", nome: "Intelligenza", spiega: "Logica e memoria: sapere, indagare, magia arcana." },
  { key: "sag", nome: "Saggezza", spiega: "Percezione e intuito: attenzione all'ambiente, magia divina e naturale." },
  { key: "car", nome: "Carisma", spiega: "Presenza e forza di volontà: convincere, ispirare, magia innata." },
];

const RUNE_POOL = ["ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚾ","ᛁ","ᛃ","ᛇ","ᛈ","ᛉ","ᛊ","ᛏ","ᛒ","ᛖ","ᛗ","ᛚ","ᛜ","ᛞ","ᛟ"];

const SPECIES = [
  { id: "umano", nome: "Umano", rune: "ᚨ", taglia: "Media", altezza: "1,50–1,90 m", velocita: 30,
    riassunto: "Versatili e adattabili, prosperano in ogni angolo del mondo grazie alla loro determinazione.",
    tratti: [
      { nome: "Ingegnosi", testo: "Ottieni competenza in un'abilità a tua scelta." },
      { nome: "Versatili", testo: "Ottieni un talento di Origine aggiuntivo al 1° livello, oltre a quello del background." },
    ]},
  { id: "elfo", nome: "Elfo", rune: "ᛖ", taglia: "Media", altezza: "1,50–1,85 m", velocita: 30,
    riassunto: "Popolo magico legato ai boschi e alle stelle, con sensi acuti e una lunghissima memoria.",
    tratti: [
      { nome: "Scurovisione", testo: "Vedi al buio fino a 18 metri come se fosse penombra." },
      { nome: "Ascendenza Fatata", testo: "Vantaggio contro l'essere affascinato; sei immune al sonno magico." },
      { nome: "Sensi Acuti", testo: "Ottieni competenza in Percezione." },
      { nome: "Trance", testo: "Non dormi: mediti 4 ore per ottenere i benefici di un riposo lungo." },
    ],
    sottospecieLabel: "Lignaggio",
    sottospecie: [
      { id: "alto-elfo", nome: "Alto Elfo", testo: "Conosci il trucchetto Fuoco Fatuo (o un altro dalla lista del Mago) e puoi cambiarlo dopo un riposo lungo." },
      { id: "elfo-boschi", nome: "Elfo dei Boschi", testo: "La tua velocità aumenta a 10,5 m e puoi nasconderti anche se sei solo leggermente ostacolato alla vista dopo esserti mosso." },
      { id: "elfo-nero", nome: "Elfo Nero (Drow)", testo: "Scurovisione estesa a 36 metri; conosci il trucchetto Luci Danzanti e, salendo di livello, incantesimi come Fuoco Fatato e Oscurità." },
    ]},
  { id: "nano", nome: "Nano", rune: "ᚦ", taglia: "Media", altezza: "1,30–1,50 m", velocita: 30,
    riassunto: "Robusti figli della pietra, instancabili minatori e artigiani, difficili da abbattere.",
    tratti: [
      { nome: "Scurovisione", testo: "Vedi al buio fino a 36 metri come se fosse penombra." },
      { nome: "Resilienza Nanica", testo: "Vantaggio contro l'essere avvelenato e resistenza ai danni da veleno." },
      { nome: "Robustezza Nanica", testo: "I tuoi punti ferita massimi aumentano di 1 per ogni livello." },
      { nome: "Conoscenza della Pietra", testo: "Tremorsenso attraverso la pietra e competenza in Storia su manufatti in pietra." },
    ]},
  { id: "halfling", nome: "Halfling", rune: "ᚺ", taglia: "Piccola", altezza: "0,85–1,05 m", velocita: 30,
    riassunto: "Piccoli, curiosi e fortunati: affrontano il pericolo con un sorriso e un pizzico di fortuna.",
    tratti: [
      { nome: "Fortunati", testo: "Quando ottieni un 1 naturale in un tiro, puoi ripetere il dado." },
      { nome: "Coraggiosi", testo: "Vantaggio contro l'essere spaventato." },
      { nome: "Agilità Halfling", testo: "Puoi muoverti attraverso lo spazio di creature più grandi di te." },
    ]},
  { id: "gnomo", nome: "Gnomo", rune: "ᚷ", taglia: "Piccola", altezza: "0,90–1,20 m", velocita: 30,
    riassunto: "Curiosi inventori e studiosi: nascondono una mente arguta dietro l'entusiasmo.",
    tratti: [
      { nome: "Scurovisione", testo: "Vedi al buio fino a 18 metri come se fosse penombra." },
      { nome: "Astuzia Gnomica", testo: "Vantaggio ai TS su Intelligenza, Saggezza e Carisma contro la magia." },
    ],
    sottospecieLabel: "Lignaggio",
    sottospecie: [
      { id: "gnomo-rocce", nome: "Gnomo delle Rocce", testo: "Conosci il trucchetto Prestidigitazione e puoi costruire un piccolo automa giocattolo con parti meccaniche." },
      { id: "gnomo-boschi", nome: "Gnomo dei Boschi", testo: "Conosci il trucchetto Illusione Minore e puoi comunicare in modo semplice con piccole bestie." },
    ]},
  { id: "dragonide", nome: "Dragonide", rune: "ᛞ", taglia: "Media", altezza: "1,80–2,10 m", velocita: 30,
    riassunto: "Discendenti dei draghi, fieri e onorevoli: portano nel sangue il soffio dei loro antenati.",
    tratti: [
      { nome: "Scurovisione", testo: "Vedi al buio fino a 18 metri come se fosse penombra." },
      { nome: "Arma del Soffio", testo: "Come azione, esali energia distruttiva: puoi scegliere ogni volta se in un cono di 4,5 m o in una linea di 9 m. Il tipo di danno dipende dagli antenati draconici scelti. Le creature nell'area tirano Salvezza su Destrezza (CD 8 + bonus di competenza + il tuo modificatore di Costituzione): 1d10 danni al 1° livello, 2d10 al 5°, 3d10 all'11° e 4d10 al 17°, dimezzati con un tiro riuscito. Puoi usarlo un numero di volte pari al tuo bonus di competenza, recuperando tutti gli usi con un riposo lungo." },
      { nome: "Volo Draconico (dal 5° livello)", testo: "Come azione bonus, ti spuntano ali spettrali per 10 minuti, che ti danno una velocità di volo pari alla tua velocità normale. Puoi farle scomparire prima come azione gratuita, e scompaiono comunque se resti incapacitato, cadi a terra o vieni afferrato. Puoi usare questo tratto una volta, recuperando l'uso con un riposo lungo." },
    ],
    sottospecieLabel: "Antenati Draconici",
    sottospecie: [
      { id: "nero", nome: "Drago Nero", testo: "Soffio ad acido e resistenza ai danni da acido." },
      { id: "blu", nome: "Drago Blu", testo: "Soffio a fulmine e resistenza ai danni da fulmine." },
      { id: "verde", nome: "Drago Verde", testo: "Soffio a veleno e resistenza ai danni da veleno." },
      { id: "rosso", nome: "Drago Rosso", testo: "Soffio a fuoco e resistenza ai danni da fuoco." },
      { id: "bianco", nome: "Drago Bianco", testo: "Soffio a freddo e resistenza ai danni da freddo." },
      { id: "ottone", nome: "Drago d'Ottone", testo: "Soffio a fuoco e resistenza ai danni da fuoco." },
      { id: "bronzo", nome: "Drago di Bronzo", testo: "Soffio a fulmine e resistenza ai danni da fulmine." },
      { id: "rame", nome: "Drago di Rame", testo: "Soffio ad acido e resistenza ai danni da acido." },
      { id: "oro", nome: "Drago d'Oro", testo: "Soffio a fuoco e resistenza ai danni da fuoco." },
      { id: "argento", nome: "Drago d'Argento", testo: "Soffio a freddo e resistenza ai danni da freddo." },
    ]},
  { id: "orco", nome: "Orco", rune: "ᚱ", taglia: "Media", altezza: "1,80–2,10 m", velocita: 30,
    riassunto: "Instancabili e risoluti: trovano forza nella determinazione più che nella disperazione.",
    tratti: [
      { nome: "Scurovisione", testo: "Vedi al buio fino a 36 metri come se fosse penombra." },
      { nome: "Impeto Adrenalinico", testo: "Puoi scattare come azione bonus e guadagnare pf temporanei (1 volta a riposo breve)." },
      { nome: "Resistenza Instancabile", testo: "Se sei ridotto a 0 pf senza morire, puoi restare a 1 pf (1 volta a riposo lungo)." },
    ]},
  { id: "tiefling", nome: "Tiefling", rune: "ᛉ", taglia: "Media", altezza: "1,50–1,90 m", velocita: 30,
    riassunto: "Segnati da un'eredità infernale: portano dentro di sé una scintilla di fuoco ultraterreno.",
    tratti: [
      { nome: "Scurovisione", testo: "Vedi al buio fino a 18 metri come se fosse penombra." },
      { nome: "Presenza Ultraterrena", testo: "Conosci il trucchetto Taumaturgia." },
      { nome: "Resistenza Ultraterrena", testo: "Ottieni resistenza al tipo di danno legato all'eredità scelta." },
    ],
    sottospecieLabel: "Eredità",
    sottospecie: [
      { id: "abissale", nome: "Eredità Abissale", testo: "Resistenza ai danni da veleno; crescendo di livello impari incantesimi come Spruzzo Velenoso e Raggio Debilitante." },
      { id: "ctonia", nome: "Eredità Ctonia", testo: "Resistenza ai danni necrotici; crescendo di livello impari incantesimi come Falsa Vita e Oscurità." },
      { id: "infernale", nome: "Eredità Infernale", testo: "Resistenza ai danni da fuoco; crescendo di livello impari incantesimi come Rimprovero Infernale e Oscurità." },
    ]},
  { id: "aasimar", nome: "Aasimar", rune: "ᛊ", taglia: "Media", altezza: "1,50–1,90 m", velocita: 30,
    riassunto: "Toccati dal Piano Celestiale: portano dentro di sé una luce che può guarire o incenerire.",
    tratti: [
      { nome: "Scurovisione", testo: "Vedi al buio fino a 18 metri come se fosse penombra." },
      { nome: "Resistenza Celestiale", testo: "Resistenza ai danni necrotici e radiosi." },
      { nome: "Mani Guaritrici", testo: "Come azione puoi curare una creatura toccata." },
      { nome: "Portatore di Luce", testo: "Conosci il trucchetto Luce." },
    ]},
  { id: "goliath", nome: "Goliath", rune: "ᛗ", taglia: "Media", altezza: "2,10–2,30 m", velocita: 35,
    riassunto: "Nati tra le vette più alte: misurano il proprio valore nelle imprese contro la natura selvaggia.",
    tratti: [
      { nome: "Costituzione Possente", testo: "Conti come una taglia superiore per trasportare e spingere pesi." },
    ],
    sottospecieLabel: "Ascendenza gigante",
    sottospecie: [
      { id: "nube", nome: "Discendenza della Nube", testo: "Quando colpisci con un attacco puoi teletrasportarti per un breve tratto (una volta per riposo breve)." },
      { id: "fuoco", nome: "Discendenza del Fuoco", testo: "Quando colpisci con un attacco infliggi danno da fuoco aggiuntivo." },
      { id: "gelo", nome: "Discendenza del Gelo", testo: "Quando colpisci con un attacco infliggi danno da freddo aggiuntivo e riduci la velocità del bersaglio." },
      { id: "collina", nome: "Discendenza della Collina", testo: "Quando colpisci con un attacco puoi far cadere a terra il bersaglio." },
      { id: "pietra", nome: "Discendenza della Pietra", testo: "Una volta per turno puoi ridurre il danno che subisci da un attacco." },
      { id: "tempesta", nome: "Discendenza della Tempesta", testo: "Quando subisci danno da un attacco in mischia, puoi restituire danno da tuono all'attaccante." },
    ]},
  { id: "dhampir", nome: "Dhampir", rune: "ᚻ", taglia: "Media o Piccola (a scelta)", altezza: "variabile, in base alla taglia scelta", velocita: 35, fonte: "Van Richten's Guide to Ravenloft",
    riassunto: "Porta nel sangue una scintilla di potere vampirico, spesso frutto di un morso non giunto a compimento o di un patto oscuro.",
    tratti: [
      { nome: "Scurovisione", testo: "Vedi al buio fino a 18 metri come se fosse penombra." },
      { nome: "Natura Senza Respiro", testo: "Non hai bisogno di respirare." },
      { nome: "Scalata Ragnesca", testo: "Hai una velocità di scalata pari alla velocità normale; dal 3° livello puoi muoverti su superfici verticali e soffitti tenendo le mani libere." },
      { nome: "Morso Vampirico", testo: "Il tuo morso è un'arma naturale: usi il modificatore di Costituzione al posto della Forza, infligge 1d10 danni perforanti e hai vantaggio se sei a metà punti ferita o meno. Colpendo una creatura vivente puoi curarti dei danni inflitti oppure ottenere un bonus al prossimo attacco o prova, un numero di volte pari al bonus di competenza per riposo lungo." },
      { nome: "Eredità Ancestrale", testo: "Ottieni competenza in due abilità a tua scelta." },
    ]},
  { id: "hexblood", nome: "Hexblood", rune: "ᛃ", taglia: "Media o Piccola (a scelta)", altezza: "variabile, in base alla taglia scelta", velocita: 30, fonte: "Van Richten's Guide to Ravenloft",
    riassunto: "Trasformato dalla magia selvaggia di una strega, porta sulla pelle segni innaturali e un legame con il patto stretto.",
    tratti: [
      { nome: "Scurovisione", testo: "Vedi al buio fino a 18 metri come se fosse penombra." },
      { nome: "Gettone Sinistro", testo: "Come azione bonus puoi imbevere di magia un tuo capello, unghia o dente: puoi poi inviare un messaggio telepatico di massimo 25 parole a chi lo porta con sé, oppure entrare in trance per vedere e sentire attraverso il gettone, entro 16 km. Un uso per riposo lungo." },
      { nome: "Magia della Strega", testo: "Conosci gli incantesimi Inganno Personale e Maledizione, lanciabili ciascuno una volta senza consumare slot; recuperi l'uso con un riposo lungo." },
      { nome: "Eredità Ancestrale", testo: "Ottieni competenza in due abilità a tua scelta." },
    ]},
  { id: "reborn", nome: "Reborn", rune: "ᛒ", taglia: "Media o Piccola (a scelta)", altezza: "variabile, in base alla taglia scelta", velocita: 30, fonte: "Van Richten's Guide to Ravenloft",
    riassunto: "Un tempo morto, è tornato a camminare tra i vivi: porta cicatrici, memorie frammentate e un corpo che non teme più la fine.",
    tratti: [
      { nome: "Scurovisione", testo: "Vedi al buio fino a 18 metri come se fosse penombra." },
      { nome: "Natura Senza Morte", testo: "Vantaggio ai TS contro malattie e veleno e resistenza ai danni da veleno; vantaggio ai tiri salvezza contro la morte; non hai bisogno di mangiare, bere, respirare o dormire (sei immune al sonno magico) e completi un riposo lungo in sole 4 ore restando immobile e cosciente." },
      { nome: "Conoscenza di una Vita Passata", testo: "Quando effettui una prova che coinvolge un'abilità, puoi tirare 1d6 e sommarlo al risultato; un numero di volte pari al bonus di competenza, recuperate con un riposo lungo." },
      { nome: "Eredità Ancestrale", testo: "Ottieni competenza in due abilità a tua scelta." },
    ]},
  { id: "changeling", nome: "Changeling", rune: "ᚹ", taglia: "Media o Piccola (a scelta)", altezza: "variabile, in base alla taglia scelta", velocita: 30, fonte: "Eberron: Forge of the Artificer",
    riassunto: "Dall'aspetto sempre mutevole, i changeling vivono spesso nascosti tra le altre genti, cambiando volto quando serve.",
    tratti: [
      { nome: "Istinti da Cambiaforma", testo: "Ottieni competenza in due tra Inganno, Intuizione e Persuasione a tua scelta." },
      { nome: "Cambiaforma", testo: "Come azione, cambi aspetto (altezza, peso, lineamenti, voce) assumendo la forma di un altro umanoide di taglia simile, oppure il tuo aspetto naturale. La nuova forma resta finché non la cambi di nuovo o finché non muori; non ottieni le capacità della creatura imitata." },
      { nome: "Eredità Ancestrale", testo: "Ottieni competenza in due abilità a tua scelta." },
    ]},
  { id: "kalashtar", nome: "Kalashtar", rune: "ᛞ", taglia: "Media", altezza: "1,50–1,90 m", velocita: 30, fonte: "Eberron: Forge of the Artificer",
    riassunto: "Nati dall'unione tra un umano e uno spirito onirico ribelle, portano dentro di sé un legame con il Piano dei Sogni.",
    tratti: [
      { nome: "Mente Duale", testo: "Vantaggio ai tiri salvezza su Saggezza." },
      { nome: "Disciplina Mentale", testo: "Resistenza ai danni psichici." },
      { nome: "Legame Mentale", testo: "Come azione, stabilisci un legame telepatico con una creatura che vedi entro 9 metri: potete comunicare telepaticamente finché siete nella stessa area, un numero di volte pari al bonus di competenza per riposo lungo." },
      { nome: "Recisi dai Sogni", testo: "Non sogni normalmente e sei immune agli effetti che richiedono di dormire per funzionare; le creature non possono localizzarti o leggerti nel sonno." },
      { nome: "Eredità Ancestrale", testo: "Ottieni competenza in due abilità a tua scelta." },
    ]},
  { id: "khoravar", nome: "Khoravar", rune: "ᛖ", taglia: "Media", altezza: "1,50–1,90 m", velocita: 30, fonte: "Eberron: Forge of the Artificer",
    riassunto: "Discendenti misti di umani ed elfi, hanno costruito proprie comunità e tradizioni a Khorvaire.",
    tratti: [
      { nome: "Scurovisione", testo: "Vedi al buio fino a 18 metri come se fosse penombra." },
      { nome: "Ascendenza Fatata", testo: "Vantaggio ai TS contro l'essere affascinato." },
      { nome: "Dono Fatato", testo: "Puoi lanciare un incantesimo di incanto minore (come Amicizia con gli Animali) una volta senza consumare uno slot; recuperi l'uso con un riposo lungo." },
      { nome: "Resistenza alla Spossatezza", testo: "Vantaggio ai TS contro l'essere addormentato magicamente o contro l'accumulo di spossatezza." },
      { nome: "Versatilità nelle Abilità", testo: "Dopo un riposo lungo, puoi cambiare una competenza in un'abilità o in uno strumento con un'altra a tua scelta." },
    ]},
  { id: "shifter", nome: "Shifter", rune: "ᚱ", taglia: "Media", altezza: "1,60–1,95 m", velocita: 30, fonte: "Eberron: Forge of the Artificer",
    riassunto: "Discendenti di chi ha contratto una forma parziale di licantropia, portano nell'aspetto un tratto bestiale.",
    tratti: [
      { nome: "Scurovisione", testo: "Vedi al buio fino a 18 metri come se fosse penombra." },
      { nome: "Istinti Bestiali", testo: "Ottieni competenza in Percezione o Sopravvivenza a tua scelta." },
      { nome: "Trasformazione", testo: "Come azione bonus assumi un aspetto più bestiale per 1 minuto: ottieni punti ferita temporanei e un beneficio legato alla tua stirpe di provenienza (a scelta tra alcune varianti, es. zanne che mordono o maggiore velocità). Recuperi l'uso con un riposo breve o lungo." },
      { nome: "Eredità Ancestrale", testo: "Ottieni competenza in due abilità a tua scelta." },
    ]},
  { id: "warforged", nome: "Warforged", rune: "ᛏ", taglia: "Media", altezza: "1,70–2,00 m", velocita: 30, fonte: "Eberron: Forge of the Artificer",
    riassunto: "Costrutti viventi forgiati come armi da guerra, oggi cercano un nuovo scopo oltre il conflitto per cui sono nati.",
    tratti: [
      { nome: "Costrutto", testo: "Sei di tipo Costrutto: non hai bisogno di mangiare, bere o respirare, e sei immune alle malattie." },
      { nome: "Resilienza da Costrutto", testo: "Vantaggio ai TS contro veleno e resistenza ai danni da veleno; vantaggio ai TS per non essere spossato." },
      { nome: "Protezione Integrata", testo: "Il tuo corpo ha una componente corazzata: ottieni +1 alla Classe Armatura anche senza indossare armatura (cumulabile con lo scudo)." },
      { nome: "Riposo da Sentinella", testo: "Non dormi: resti immobile e semi-cosciente per 6 ore per ottenere i benefici di un riposo lungo." },
      { nome: "Progettazione Specializzata", testo: "Ottieni competenza in uno strumento a tua scelta." },
      { nome: "Instancabile", testo: "Come azione bonus, ottieni punti ferita temporanei; puoi farlo una volta per riposo lungo (di più a livelli superiori)." },
    ]},
];

const CLASSES = [
  { id: "barbaro", nome: "Barbaro", rune: "ᚻ", dado: 12, ts: ["for", "cos"], sceltaAbilita: 2,
    ruolo: "Combattente in prima linea: infligge e assorbe grandi quantità di danno.",
    riassunto: "Canalizza una furia primordiale che lo rende quasi inarrestabile in combattimento.",
    abilitaLista: ["Addestrare Animali","Atletica","Intimidire","Natura","Percezione","Sopravvivenza"],
    armiCategorie: ["semplici_mischia","semplici_distanza","marziali_mischia","marziali_distanza"], armature: ["leggera","media"], scudo: true , oro: 75 },
  { id: "bardo", nome: "Bardo", rune: "ᛚ", dado: 8, ts: ["des", "car"], sceltaAbilita: 3,
    ruolo: "Supporto versatile: ispira gli alleati e controlla il campo di battaglia con la magia.",
    riassunto: "Intreccia musica e magia per ispirare gli alleati e disarmare i nemici.",
    abilitaLista: ["Acrobazia","Addestrare Animali","Arcano","Atletica","Furtività","Indagare","Inganno","Intimidire","Intrattenere","Intuizione","Medicina","Natura","Percezione","Persuasione","Rapidità di Mano","Religione","Sopravvivenza","Storia"],
    armiCategorie: ["semplici_mischia","semplici_distanza"], armature: ["leggera"], scudo: false , oro: 90 },
  { id: "chierico", nome: "Chierico", rune: "ᛟ", dado: 8, ts: ["sag", "car"], sceltaAbilita: 2,
    ruolo: "Guaritore e supporto divino, capace anche di combattere in prima linea.",
    riassunto: "Canalizza il potere di una divinità per curare gli alleati e respingere il male.",
    abilitaLista: ["Storia","Intuizione","Medicina","Persuasione","Religione"],
    armiCategorie: ["semplici_mischia","semplici_distanza"], armature: ["leggera","media"], scudo: true , oro: 110 },
  { id: "druido", nome: "Druido", rune: "ᚾ", dado: 8, ts: ["int", "sag"], sceltaAbilita: 2,
    ruolo: "Custode della natura: si trasforma in animali e controlla gli elementi.",
    riassunto: "Parla la lingua segreta della natura e ne assume persino le forme.",
    abilitaLista: ["Arcano","Addestrare Animali","Intuizione","Medicina","Natura","Percezione","Religione","Sopravvivenza"],
    armiCategorie: ["semplici_mischia","semplici_distanza"], armature: ["leggera","media"], scudo: true , oro: 50 },
  { id: "guerriero", nome: "Guerriero", rune: "ᛁ", dado: 10, ts: ["for", "cos"], sceltaAbilita: 2,
    ruolo: "Maestro delle armi, adattabile a qualunque stile di combattimento.",
    riassunto: "Un'incrollabile disciplina marziale forgiata da anni di addestramento.",
    abilitaLista: ["Acrobazia","Addestrare Animali","Atletica","Storia","Intuizione","Intimidire","Percezione","Sopravvivenza"],
    armiCategorie: ["semplici_mischia","semplici_distanza","marziali_mischia","marziali_distanza"], armature: ["leggera","media","pesante"], scudo: true , oro: 155 },
  { id: "monaco", nome: "Monaco", rune: "ᛃ", dado: 8, ts: ["for", "des"], sceltaAbilita: 2,
    ruolo: "Combattente agile e mistico: canalizza l'energia interiore nei suoi colpi.",
    riassunto: "Disciplina corpo e spirito fino a trasformarli in un'arma perfetta.",
    abilitaLista: ["Acrobazia","Atletica","Storia","Intuizione","Religione","Furtività"],
    armiCategorie: ["semplici_mischia","semplici_distanza"], armature: [], scudo: false , oro: 50 },
  { id: "paladino", nome: "Paladino", rune: "ᚹ", dado: 10, ts: ["sag", "car"], sceltaAbilita: 2,
    ruolo: "Guerriero sacro: protegge gli alleati e punisce i nemici con la luce divina.",
    riassunto: "Un giuramento solenne alimenta il suo potere e guida ogni sua azione.",
    abilitaLista: ["Atletica","Intuizione","Intimidire","Medicina","Persuasione","Religione"],
    armiCategorie: ["semplici_mischia","semplici_distanza","marziali_mischia","marziali_distanza"], armature: ["leggera","media","pesante"], scudo: true , oro: 150 },
  { id: "ranger", nome: "Ranger", rune: "ᛜ", dado: 10, ts: ["for", "des"], sceltaAbilita: 3,
    ruolo: "Esploratore e cacciatore: letale a distanza, a suo agio in ogni terreno.",
    riassunto: "Sorveglia i confini tra la civiltà e la natura selvaggia.",
    abilitaLista: ["Addestrare Animali","Atletica","Intuizione","Indagare","Natura","Percezione","Furtività","Sopravvivenza"],
    armiCategorie: ["semplici_mischia","semplici_distanza","marziali_mischia","marziali_distanza"], armature: ["leggera","media"], scudo: true , oro: 150 },
  { id: "ladro", nome: "Ladro", rune: "ᛈ", dado: 8, ts: ["des", "int"], sceltaAbilita: 4,
    ruolo: "Specialista furtivo: letale con un colpo a sorpresa, abile in imprese poco oneste.",
    riassunto: "Precisione, furtività e un pizzico di fortuna sono i suoi strumenti del mestiere.",
    abilitaLista: ["Acrobazia","Atletica","Inganno","Intuizione","Intimidire","Indagare","Percezione","Intrattenere","Persuasione","Rapidità di Mano","Furtività"],
    armiCategorie: ["semplici_mischia","semplici_distanza"], armature: ["leggera"], scudo: false , oro: 100 },
  { id: "stregone", nome: "Stregone", rune: "ᚲ", dado: 6, ts: ["cos", "car"], sceltaAbilita: 2,
    ruolo: "Incantatore che porta la magia nel sangue, capace di plasmarla in modi unici.",
    riassunto: "La magia scorre nelle sue vene per nascita, non per studio.",
    abilitaLista: ["Arcano","Inganno","Intuizione","Intimidire","Persuasione","Religione"],
    armiCategorie: ["semplici_mischia","semplici_distanza"], armature: [], scudo: false , oro: 50 },
  { id: "warlock", nome: "Warlock", rune: "ᛇ", dado: 8, ts: ["sag", "car"], sceltaAbilita: 2,
    ruolo: "Incantatore che ha stretto un patto con un'entità potente in cambio di poteri oscuri.",
    riassunto: "Il suo potere è un debito contratto con qualcosa di antico e non del tutto umano.",
    abilitaLista: ["Arcano","Inganno","Storia","Intimidire","Indagare","Natura","Religione"],
    armiCategorie: ["semplici_mischia","semplici_distanza"], armature: ["leggera"], scudo: false , oro: 100 },
  { id: "mago", nome: "Mago", rune: "ᚢ", dado: 6, ts: ["int", "sag"], sceltaAbilita: 2,
    ruolo: "Studioso della magia arcana, capace di plasmare la realtà attraverso lo studio.",
    riassunto: "Ogni incantesimo è il frutto di anni di studio custoditi nel suo Grimorio.",
    abilitaLista: ["Arcano","Storia","Intuizione","Indagare","Medicina","Religione"],
    armiCategorie: ["semplici_mischia"], armature: [], scudo: false , oro: 55 },
];

const BACKGROUNDS = [
  { id: "accolito", nome: "Accolito", rune: "ᛟ", abilitaPunteggi: ["int","sag","car"], competenze: ["Intuizione","Religione"], strumento: "Kit da erborista",
    talento: { nome: "Iniziato alla Magia (Chierico)", testo: "Impari due trucchetti e un incantesimo di 1° livello dalla lista del Chierico, lanciabile una volta al giorno senza consumare slot." },
    riassunto: "Hai servito in un luogo di culto, imparando i rituali della tua fede." },
  { id: "artigiano", nome: "Artigiano", rune: "ᚷ", abilitaPunteggi: ["for","des","int"], competenze: ["Indagare","Persuasione"], strumento: "Strumenti da artigiano a scelta",
    talento: { nome: "Artigiano", testo: "Ottieni competenza con strumenti da artigiano e fabbrichi oggetti comuni più rapidamente." },
    riassunto: "Hai imparato un mestiere manuale, dalla bottega alla bancarella del mercato." },
  { id: "ciarlatano", nome: "Ciarlatano", rune: "ᛃ", abilitaPunteggi: ["des","cos","car"], competenze: ["Inganno","Rapidità di Mano"], strumento: "Kit da falsario",
    talento: { nome: "Talentuoso", testo: "Ottieni competenza in altre tre abilità o strumenti a tua scelta." },
    riassunto: "Hai vissuto di inganni, travestimenti e promesse mai mantenute." },
  { id: "criminale", nome: "Criminale", rune: "ᛊ", abilitaPunteggi: ["des","cos","int"], competenze: ["Rapidità di Mano","Furtività"], strumento: "Strumenti da scasso",
    talento: { nome: "All'Erta", testo: "Non puoi essere colto di sorpresa mentre sei cosciente e ottieni un bonus all'iniziativa." },
    riassunto: "Hai vissuto ai margini della legge, tra colpi rischiosi e fughe rocambolesche." },
  { id: "intrattenitore", nome: "Intrattenitore", rune: "ᛚ", abilitaPunteggi: ["for","des","car"], competenze: ["Acrobazia","Intrattenere"], strumento: "Uno strumento musicale a scelta",
    talento: { nome: "Musicista", testo: "Dopo un riposo puoi suonare per donare Ispirazione Eroica a te stesso e ai compagni." },
    riassunto: "Hai calcato palchi e piazze, vivendo di applausi e monete lanciate." },
  { id: "contadino", nome: "Contadino", rune: "ᚾ", abilitaPunteggi: ["for","cos","sag"], competenze: ["Addestrare Animali","Natura"], strumento: "Attrezzi da falegname",
    talento: { nome: "Resistente", testo: "I tuoi punti ferita massimi aumentano subito e continuano ad aumentare a ogni livello." },
    riassunto: "Sei cresciuto lavorando la terra, tra raccolti e bestiame." },
  { id: "guardia", nome: "Guardia", rune: "ᛁ", abilitaPunteggi: ["for","int","sag"], competenze: ["Atletica","Percezione"], strumento: "Set da gioco a scelta",
    talento: { nome: "All'Erta", testo: "Non puoi essere colto di sorpresa mentre sei cosciente e ottieni un bonus all'iniziativa." },
    riassunto: "Hai pattugliato mura, porte e strade, vigilando sulla sicurezza altrui." },
  { id: "guida", nome: "Guida", rune: "ᛜ", abilitaPunteggi: ["des","cos","sag"], competenze: ["Furtività","Sopravvivenza"], strumento: "Strumenti del cartografo",
    talento: { nome: "Iniziato alla Magia (Druido)", testo: "Impari due trucchetti e un incantesimo di 1° livello dalla lista del Druido, lanciabile una volta al giorno senza consumare slot." },
    riassunto: "Conosci sentieri che pochi altri oserebbero percorrere." },
  { id: "eremita", nome: "Eremita", rune: "ᚦ", abilitaPunteggi: ["cos","sag","car"], competenze: ["Medicina","Religione"], strumento: "Kit da erborista",
    talento: { nome: "Guaritore", testo: "Con un kit da guaritore puoi ridare punti ferita extra fuori dal combattimento." },
    riassunto: "Hai vissuto isolato, in cerca di risposte lontano dal mondo." },
  { id: "mercante", nome: "Mercante", rune: "ᚨ", abilitaPunteggi: ["cos","int","car"], competenze: ["Addestrare Animali","Persuasione"], strumento: "Strumenti da navigatore",
    talento: { nome: "Fortunato", testo: "Hai punti fortuna da spendere per ottenere vantaggio o far ripetere il tiro di un avversario." },
    riassunto: "Hai viaggiato tra fiere e carovane, imparando l'arte della contrattazione." },
  { id: "nobile", nome: "Nobile", rune: "ᛗ", abilitaPunteggi: ["for","int","car"], competenze: ["Storia","Persuasione"], strumento: "Set da gioco a scelta",
    talento: { nome: "Talentuoso", testo: "Ottieni competenza in altre tre abilità o strumenti a tua scelta." },
    riassunto: "Sei cresciuto tra privilegi e responsabilità di un casato importante." },
  { id: "saggio", nome: "Saggio", rune: "ᚢ", abilitaPunteggi: ["cos","int","sag"], competenze: ["Arcano","Storia"], strumento: "Kit da calligrafo",
    talento: { nome: "Iniziato alla Magia (Mago)", testo: "Impari due trucchetti e un incantesimo di 1° livello dalla lista del Mago, lanciabile una volta al giorno senza consumare slot." },
    riassunto: "Hai passato anni sui libri, tra biblioteche e archivi polverosi." },
  { id: "marinaio", nome: "Marinaio", rune: "ᛖ", abilitaPunteggi: ["for","des","sag"], competenze: ["Acrobazia","Percezione"], strumento: "Strumenti da navigatore",
    talento: { nome: "Rissaiolo da Taverna", testo: "I tuoi colpi senz'armi infliggono più danno e puoi tentare di afferrare l'avversario colpendolo." },
    riassunto: "Il mare è stato la tua casa, tra tempeste e porti sconosciuti." },
  { id: "scriba", nome: "Scriba", rune: "ᛞ", abilitaPunteggi: ["des","int","sag"], competenze: ["Indagare","Percezione"], strumento: "Kit da calligrafo",
    talento: { nome: "Talentuoso", testo: "Ottieni competenza in altre tre abilità o strumenti a tua scelta." },
    riassunto: "Hai trascritto testi e documenti, con un occhio attento a ogni dettaglio." },
  { id: "soldato", nome: "Soldato", rune: "ᚻ", abilitaPunteggi: ["for","des","cos"], competenze: ["Atletica","Intimidire"], strumento: "Set da gioco a scelta",
    talento: { nome: "Attacco Selvaggio", testo: "Una volta per turno puoi tirare due volte i dadi danno di un'arma e tenere il risultato migliore." },
    riassunto: "Hai servito in un esercito, imparando la disciplina e il peso della battaglia." },
  { id: "viandante", nome: "Viandante", rune: "ᛉ", abilitaPunteggi: ["des","sag","car"], competenze: ["Intuizione","Furtività"], strumento: "Strumenti del cartografo",
    talento: { nome: "Fortunato", testo: "Hai punti fortuna da spendere per ottenere vantaggio o far ripetere il tiro di un avversario." },
    riassunto: "Hai vissuto sulla strada, senza mai fermarti troppo a lungo in un solo posto." },
];

const SKILLS = [
  { nome: "Acrobazia", ab: "des" }, { nome: "Addestrare Animali", ab: "sag" }, { nome: "Arcano", ab: "int" },
  { nome: "Atletica", ab: "for" }, { nome: "Furtività", ab: "des" }, { nome: "Indagare", ab: "int" },
  { nome: "Inganno", ab: "car" }, { nome: "Intimidire", ab: "car" }, { nome: "Intrattenere", ab: "car" },
  { nome: "Intuizione", ab: "sag" }, { nome: "Medicina", ab: "sag" }, { nome: "Natura", ab: "int" },
  { nome: "Percezione", ab: "sag" }, { nome: "Persuasione", ab: "car" }, { nome: "Rapidità di Mano", ab: "des" },
  { nome: "Religione", ab: "int" }, { nome: "Sopravvivenza", ab: "sag" }, { nome: "Storia", ab: "int" },
];

const EQUIPAGGIAMENTO = {
  barbaro: ["Uno zaino da esploratore", "Un cimelio di famiglia"],
  bardo: ["Uno strumento musicale a scelta", "Uno zaino da intrattenitore"],
  chierico: ["Un simbolo sacro", "Uno zaino da religioso"],
  druido: ["Un focus druidico", "Uno zaino da esploratore"],
  guerriero: ["Uno zaino da esploratore"],
  monaco: ["Uno zaino da esploratore"],
  paladino: ["Un simbolo sacro", "Uno zaino da religioso"],
  ranger: ["Uno zaino da esploratore"],
  ladro: ["Strumenti da scasso", "Uno zaino da ladro"],
  stregone: ["Un focus arcano", "Uno zaino da esploratore"],
  warlock: ["Un focus arcano", "Uno zaino da studioso"],
  mago: ["Un focus arcano o componente", "Un libro degli incantesimi", "Uno zaino da studioso"],
};

const ARRAY_STANDARD = [15, 14, 13, 12, 10, 8];
const COSTO_PUNTI = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

const WEAPON_CATEGORIES = {
  semplici_mischia: { label: "Armi Semplici da Mischia", tipo: "mischia",
    items: ["Bastone", "Randello", "Pugnale", "Ascia da lancio", "Giavellotto", "Martello leggero", "Mazza", "Lancia", "Falce da guerra"] },
  semplici_distanza: { label: "Armi Semplici a Distanza", tipo: "distanza",
    items: ["Balestra leggera", "Fionda", "Arco corto semplice"] },
  marziali_mischia: { label: "Armi Marziali da Mischia", tipo: "mischia",
    items: ["Ascia bipenne", "Ascia da battaglia", "Martello da guerra", "Scimitarra", "Spada corta", "Spada lunga", "Spadone", "Alabarda", "Rapier", "Lancia da cavaliere"] },
  marziali_distanza: { label: "Armi Marziali a Distanza", tipo: "distanza",
    items: ["Arco lungo", "Balestra pesante", "Balestra a ripetizione"] },
};

const ARMOR_CATEGORIES = {
  leggera: { label: "Leggera", items: [
    { nome: "Armatura Imbottita", base: 11, maxDex: null },
    { nome: "Armatura di Cuoio", base: 11, maxDex: null },
    { nome: "Cuoio Borchiato", base: 12, maxDex: null },
  ]},
  media: { label: "Media", items: [
    { nome: "Camicia di Maglia", base: 12, maxDex: 2 },
    { nome: "Corazza a Scaglie", base: 13, maxDex: 2 },
    { nome: "Corazza", base: 14, maxDex: 2 },
  ]},
  pesante: { label: "Pesante", items: [
    { nome: "Cotta di Maglia", base: 16, maxDex: 0 },
    { nome: "Corazza di Piastre", base: 18, maxDex: 0 },
  ]},
};

function armorInfo(nome) {
  for (const cat of Object.values(ARMOR_CATEGORIES)) {
    const found = cat.items.find((a) => a.nome === nome);
    if (found) return found;
  }
  return null;
}
const PUNTI_TOTALI = 27;

const STEP_DEFS = [
  { label: "Benvenuto", rune: "ᛟ" },
  { label: "Specie", rune: "ᛞ" },
  { label: "Classe", rune: "ᚻ" },
  { label: "Origine", rune: "ᛗ" },
  { label: "Punteggi", rune: "ᚱ" },
  { label: "Abilità", rune: "ᛊ" },
  { label: "Equip.", rune: "ᚲ" },
  { label: "Storia", rune: "ᛃ" },
  { label: "Scheda", rune: "ᛖ" },
];

/* ============================= FUNZIONI DI SUPPORTO ============================= */

function mod(score) { return Math.floor((score - 10) / 2); }
function metri(ft) { const m = ft * 0.3; return Number.isInteger(m) ? m : m.toFixed(1); }
function fmt(n) { return (n >= 0 ? "+" : "") + n; }
function byId(list, id) { return list.find((x) => x.id === id) || null; }

/* ============================= APP ============================= */

export default function App() {
  const [step, setStep] = useState(0);
  const [nome, setNome] = useState("");
  const [specieId, setSpecieId] = useState(null);
  const [sottospecieId, setSottospecieId] = useState(null);
  const [classeId, setClasseId] = useState(null);
  const [backgroundId, setBackgroundId] = useState(null);

  const [metodo, setMetodo] = useState("standard"); // standard | pointbuy
  const [assegnazione, setAssegnazione] = useState({ for: null, des: null, cos: null, int: null, sag: null, car: null });
  const [pointBuy, setPointBuy] = useState({ for: 8, des: 8, cos: 8, int: 8, sag: 8, car: 8 });

  const [bgModo, setBgModo] = useState("duePiuUno"); // duePiuUno | unoUnoUno
  const [bgPiuDue, setBgPiuDue] = useState(null);
  const [bgPiuUno, setBgPiuUno] = useState(null);

  const [skillScelte, setSkillScelte] = useState([]);

  const [armaMischia, setArmaMischia] = useState(null);
  const [armaDistanza, setArmaDistanza] = useState(null);
  const [armaturaScelta, setArmaturaScelta] = useState(null);
  const [scudoScelto, setScudoScelto] = useState(false);
  const [preferisceOro, setPreferisceOro] = useState(false);

  const [aspetto, setAspetto] = useState("");
  const [tratti, setTratti] = useState("");
  const [ideali, setIdeali] = useState("");
  const [legami, setLegami] = useState("");
  const [difetti, setDifetti] = useState("");
  const [backstory, setBackstory] = useState("");

  const [vista, setVista] = useState("wizard"); // "wizard" | "lista"
  const [personaggioId, setPersonaggioId] = useState(null);
  const [salvataggioStato, setSalvataggioStato] = useState(null); // null | "salvando" | "salvato" | "errore"
  const [personaggiSalvati, setPersonaggiSalvati] = useState([]);
  const [caricamentoLista, setCaricamentoLista] = useState(false);

  function caricaListaPersonaggi() {
    setCaricamentoLista(true);
    try {
      const items = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("personaggi:")) {
          try {
            const v = localStorage.getItem(k);
            if (v) items.push(JSON.parse(v));
          } catch (e) { /* voce corrotta, la ignoro */ }
        }
      }
      items.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
      setPersonaggiSalvati(items);
    } catch (e) {
      setPersonaggiSalvati([]);
    }
    setCaricamentoLista(false);
  }

  useEffect(() => { if (vista === "lista") caricaListaPersonaggi(); }, [vista]);

  function nuovoPersonaggio() {
    setPersonaggioId(null); setSalvataggioStato(null);
    setNome(""); setSpecieId(null); setSottospecieId(null); setClasseId(null); setBackgroundId(null);
    setMetodo("standard"); setAssegnazione({ for: null, des: null, cos: null, int: null, sag: null, car: null });
    setPointBuy({ for: 8, des: 8, cos: 8, int: 8, sag: 8, car: 8 });
    setBgModo("duePiuUno"); setBgPiuDue(null); setBgPiuUno(null);
    setSkillScelte([]); setArmaMischia(null); setArmaDistanza(null); setArmaturaScelta(null);
    setScudoScelto(false); setPreferisceOro(false);
    setAspetto(""); setTratti(""); setIdeali(""); setLegami(""); setDifetti(""); setBackstory("");
    setVista("wizard"); setStep(0);
  }

  function salvaPersonaggio() {
    setSalvataggioStato("salvando");
    const id = personaggioId || `p_${Date.now()}`;
    const dato = {
      id, savedAt: Date.now(), nome, specieId, sottospecieId, classeId, backgroundId,
      metodo, assegnazione, pointBuy, bgModo, bgPiuDue, bgPiuUno, skillScelte,
      armaMischia, armaDistanza, armaturaScelta, scudoScelto, preferisceOro,
      aspetto, tratti, ideali, legami, difetti, backstory,
    };
    try {
      localStorage.setItem(`personaggi:${id}`, JSON.stringify(dato));
      setPersonaggioId(id);
      setSalvataggioStato("salvato");
    } catch (e) {
      setSalvataggioStato("errore");
    }
  }

  function caricaPersonaggio(dato) {
    setPersonaggioId(dato.id || null);
    setNome(dato.nome || "");
    setSpecieId(dato.specieId || null);
    setSottospecieId(dato.sottospecieId || null);
    setClasseId(dato.classeId || null);
    setBackgroundId(dato.backgroundId || null);
    setMetodo(dato.metodo || "standard");
    setAssegnazione(dato.assegnazione || { for: null, des: null, cos: null, int: null, sag: null, car: null });
    setPointBuy(dato.pointBuy || { for: 8, des: 8, cos: 8, int: 8, sag: 8, car: 8 });
    setBgModo(dato.bgModo || "duePiuUno");
    setBgPiuDue(dato.bgPiuDue || null);
    setBgPiuUno(dato.bgPiuUno || null);
    setSkillScelte(dato.skillScelte || []);
    setArmaMischia(dato.armaMischia || null);
    setArmaDistanza(dato.armaDistanza || null);
    setArmaturaScelta(dato.armaturaScelta || null);
    setScudoScelto(!!dato.scudoScelto);
    setPreferisceOro(!!dato.preferisceOro);
    setAspetto(dato.aspetto || "");
    setTratti(dato.tratti || "");
    setIdeali(dato.ideali || "");
    setLegami(dato.legami || "");
    setDifetti(dato.difetti || "");
    setBackstory(dato.backstory || "");
    setSalvataggioStato("salvato");
    setVista("wizard");
    setStep(8);
  }

  function eliminaPersonaggio(id) {
    try {
      localStorage.removeItem(`personaggi:${id}`);
      setPersonaggiSalvati((prev) => prev.filter((p) => p.id !== id));
    } catch (e) { /* riprova pure dal pulsante */ }
  }

  const specie = byId(SPECIES, specieId);
  const sottospecie = specie && specie.sottospecie ? specie.sottospecie.find((x) => x.id === sottospecieId) : null;
  const classe = byId(CLASSES, classeId);
  const background = byId(BACKGROUNDS, backgroundId);

  const puntiSpesi = useMemo(() => Object.values(pointBuy).reduce((s, v) => s + (COSTO_PUNTI[v] ?? 0), 0), [pointBuy]);
  const puntiRimasti = PUNTI_TOTALI - puntiSpesi;

  const bonusBackground = useMemo(() => {
    const b = { for: 0, des: 0, cos: 0, int: 0, sag: 0, car: 0 };
    if (!background) return b;
    if (bgModo === "unoUnoUno") {
      background.abilitaPunteggi.forEach((k) => (b[k] = 1));
    } else {
      if (bgPiuDue) b[bgPiuDue] = 2;
      if (bgPiuUno) b[bgPiuUno] = (b[bgPiuUno] || 0) + 1;
    }
    return b;
  }, [background, bgModo, bgPiuDue, bgPiuUno]);

  const punteggiBase = useMemo(() => {
    const out = {};
    ABILITIES.forEach((a) => {
      out[a.key] = metodo === "standard" ? (assegnazione[a.key] ?? 8) : pointBuy[a.key];
    });
    return out;
  }, [metodo, assegnazione, pointBuy]);

  const punteggiFinali = useMemo(() => {
    const out = {};
    ABILITIES.forEach((a) => { out[a.key] = punteggiBase[a.key] + (bonusBackground[a.key] || 0); });
    return out;
  }, [punteggiBase, bonusBackground]);

  const profBonus = 2;
  const hp = classe ? classe.dado + mod(punteggiFinali.cos) : null;

  const armiMischiaDisponibili = useMemo(() => {
    if (!classe) return [];
    const set = [];
    classe.armiCategorie.forEach((c) => { if (WEAPON_CATEGORIES[c].tipo === "mischia") set.push(...WEAPON_CATEGORIES[c].items); });
    return set;
  }, [classe]);
  const armiDistanzaDisponibili = useMemo(() => {
    if (!classe) return [];
    const set = [];
    classe.armiCategorie.forEach((c) => { if (WEAPON_CATEGORIES[c].tipo === "distanza") set.push(...WEAPON_CATEGORIES[c].items); });
    return set;
  }, [classe]);
  const armatureDisponibili = useMemo(() => {
    if (!classe) return [];
    const set = [];
    classe.armature.forEach((c) => set.push(...ARMOR_CATEGORIES[c].items));
    return set;
  }, [classe]);

  const armaturaInfo = armorInfo(armaturaScelta);
  const ac = armaturaInfo
    ? armaturaInfo.base + (armaturaInfo.maxDex === null ? mod(punteggiFinali.des) : Math.min(mod(punteggiFinali.des), armaturaInfo.maxDex)) + (scudoScelto ? 2 : 0)
    : 10 + mod(punteggiFinali.des) + (scudoScelto ? 2 : 0);
  const iniziativa = mod(punteggiFinali.des);

  function resetDaSpecieInPoi() {}

  function vaiA(n) { setStep(Math.max(0, Math.min(STEP_DEFS.length - 1, n))); }

  const puoAvanzare = () => {
    if (step === 1) return !!specieId && (!specie?.sottospecie || !!sottospecieId);
    if (step === 2) return !!classeId;
    if (step === 3) {
      if (!backgroundId) return false;
      if (bgModo === "duePiuUno") return bgPiuDue && bgPiuUno && bgPiuDue !== bgPiuUno;
      return true;
    }
    if (step === 4) {
      if (metodo === "standard") return Object.values(assegnazione).every((v) => v !== null);
      return puntiRimasti === 0;
    }
    if (step === 5) return classe && skillScelte.length === classe.sceltaAbilita;
    return true;
  };

  return (
    <div className="app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; }
        .app-root {
          --bg-void: #100d0b; --bg-panel: #1c1713; --bg-panel-2: #241d18;
          --gold: #b6893f; --gold-bright: #e0b768; --rust: #8f3324; --rust-bright: #c14a35;
          --ink: #e9dfc7; --ink-dim: #a99a80; --line: #3d332a;
          font-family: 'EB Garamond', serif;
          background: radial-gradient(ellipse at 50% -10%, #241b14 0%, var(--bg-void) 55%);
          color: var(--ink);
          min-height: 100vh;
          padding: 28px 16px;
          display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
        }
        .app-root h1, .app-root h2, .app-root h3, .rune-title { font-family: 'Cinzel', serif; letter-spacing: 0.04em; }
        .shell { width: 100%; max-width: 1080px; display: grid; grid-template-columns: 128px 1fr; gap: 16px; }
        @media (max-width: 720px) { .shell { grid-template-columns: 56px 1fr; gap: 12px; } }

        .rail { display: flex; flex-direction: column; align-items: flex-start; padding: 22px 0; position: relative; }
        .rail-track { position: absolute; top: 40px; bottom: 40px; left: 19px; width: 2px; background: var(--line); }
        .rail-track-fill { position: absolute; top: 40px; left: 19px; width: 2px; background: linear-gradient(var(--gold-bright), var(--gold)); transition: height .4s ease; box-shadow: 0 0 8px var(--gold); }
        .rail-item-wrap { display: flex; align-items: center; gap: 8px; width: 100%; margin: 12px 0; }
        .rail-item { position: relative; z-index: 1; flex: 0 0 38px; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          background: var(--bg-panel); border: 2px solid var(--line); color: var(--ink-dim); font-size: 17px; cursor: pointer; transition: all .2s; }
        .rail-item.done { border-color: var(--gold); color: var(--gold-bright); box-shadow: 0 0 10px rgba(182,137,63,.5); }
        .rail-item.active { border-color: var(--gold-bright); color: var(--ink); background: var(--bg-panel-2); transform: scale(1.15); box-shadow: 0 0 16px rgba(224,183,104,.6); }
        .rail-label { flex: 1; min-width: 0; font-size: 11px; color: var(--ink-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-transform: uppercase; letter-spacing: .06em; }
        @media (max-width: 720px) { .rail-label { display: none; } }

        .main { min-width: 0; }
        .card { background: linear-gradient(180deg, var(--bg-panel-2), var(--bg-panel)); border: 1px solid var(--line); border-radius: 6px; padding: 26px 28px; position: relative; box-shadow: 0 8px 30px rgba(0,0,0,.4), inset 0 0 60px rgba(0,0,0,.25); }
        .card::before, .card::after { content: ''; position: absolute; width: 14px; height: 14px; border: 2px solid var(--gold); opacity: .55; }
        .card::before { top: 8px; left: 8px; border-right: none; border-bottom: none; }
        .card::after { bottom: 8px; right: 8px; border-left: none; border-top: none; }
        .eyebrow { font-size: 12px; letter-spacing: .15em; text-transform: uppercase; color: var(--gold); margin-bottom: 4px; }
        .titolo { font-size: 26px; margin: 0 0 6px; color: var(--ink); }
        .sottotitolo { color: var(--ink-dim); font-size: 16px; margin: 0 0 20px; line-height: 1.5; }

        .grid-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 14px; }
        .choice { text-align: left; background: var(--bg-panel); border: 1.5px solid var(--line); border-radius: 4px; padding: 14px 16px; cursor: pointer; color: var(--ink); transition: all .15s; }
        .choice:hover { border-color: var(--gold); }
        .choice.sel { border-color: var(--gold-bright); background: var(--bg-panel-2); box-shadow: 0 0 0 1px var(--gold-bright), 0 0 18px rgba(224,183,104,.25); }
        .choice-top { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
        .choice-rune { font-size: 22px; color: var(--gold); width: 30px; text-align: center; }
        .choice-nome { font-family: 'Cinzel', serif; font-size: 16px; }
        .choice-sub { font-size: 14px; color: var(--ink-dim); line-height: 1.4; }
        .choice-meta { font-size: 12px; color: var(--gold-bright); margin-top: 6px; letter-spacing: .03em; }

        .detail { margin-top: 20px; border-top: 1px dashed var(--line); padding-top: 16px; }
        .tratto { margin-bottom: 10px; }
        .tratto b { color: var(--gold-bright); font-family: 'Cinzel', serif; font-size: 14px; }
        .tratto p { margin: 2px 0 0; font-size: 14.5px; color: var(--ink); }

        .footer-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; }
        .btn { font-family: 'Cinzel', serif; letter-spacing: .05em; padding: 10px 22px; border-radius: 3px; border: 1.5px solid var(--gold); background: transparent; color: var(--gold-bright); cursor: pointer; font-size: 14px; transition: all .15s; }
        .btn:hover:not(:disabled) { background: var(--gold); color: #1a1410; }
        .btn:disabled { opacity: .35; cursor: not-allowed; }
        .btn.primary { background: var(--gold); color: #1a1410; }
        .btn.primary:hover:not(:disabled) { background: var(--gold-bright); }

        .ability-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px,1fr)); gap: 14px; margin: 18px 0; }
        .ab-box { background: var(--bg-panel); border: 1.5px solid var(--line); border-radius: 4px; padding: 12px; text-align: center; }
        .ab-box .ab-nome { font-family: 'Cinzel', serif; font-size: 13px; color: var(--gold); text-transform: uppercase; letter-spacing: .06em; }
        .ab-box select, .ab-box input { width: 100%; background: var(--bg-void); color: var(--ink); border: 1px solid var(--line); border-radius: 3px; padding: 6px; font-size: 15px; text-align: center; margin-top: 6px; font-family: 'Cinzel', serif; }
        .ab-box .ab-final { font-size: 26px; margin-top: 8px; font-family: 'Cinzel', serif; color: var(--ink); }
        .ab-box .ab-mod { font-size: 13px; color: var(--ink-dim); }
        .pb-controls { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 6px; }
        .pb-controls button { width: 26px; height: 26px; border-radius: 50%; border: 1px solid var(--gold); background: transparent; color: var(--gold-bright); cursor: pointer; }
        .pb-controls button:disabled { opacity: .3; }
        .method-toggle { display: flex; gap: 10px; margin-bottom: 10px; }
        .method-toggle button { flex: 1; padding: 8px; border-radius: 4px; border: 1.5px solid var(--line); background: var(--bg-panel); color: var(--ink-dim); cursor: pointer; font-family: 'Cinzel', serif; font-size: 13px; }
        .method-toggle button.on { border-color: var(--gold-bright); color: var(--ink); background: var(--bg-panel-2); }
        .helper { font-size: 13px; color: var(--ink-dim); background: rgba(182,137,63,.08); border-left: 2px solid var(--gold); padding: 8px 12px; margin: 10px 0; border-radius: 2px; }

        .bg-assign { display: flex; gap: 10px; flex-wrap: wrap; margin: 14px 0; }
        .bg-pill { padding: 8px 14px; border: 1.5px solid var(--line); border-radius: 20px; cursor: pointer; font-family: 'Cinzel', serif; font-size: 13px; color: var(--ink-dim); }
        .bg-pill.on { border-color: var(--gold-bright); color: var(--ink); background: var(--bg-panel-2); }
        .bg-pill.tag2 { border-color: var(--rust); }
        .bg-pill.tag2.on { background: rgba(143,51,36,.25); color: var(--ink); }

        .skill-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 8px; margin: 14px 0; }
        .skill-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid var(--line); border-radius: 4px; background: var(--bg-panel); font-size: 14px; }
        .skill-item.locked { opacity: .55; }
        .skill-item.pickable { cursor: pointer; }
        .skill-item.pickable.on { border-color: var(--gold-bright); background: var(--bg-panel-2); }
        .skill-item .ab-tag { margin-left: auto; font-size: 11px; color: var(--gold); text-transform: uppercase; }

        .sheet { }
        .sheet-head { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 14px; border-bottom: 2px solid var(--gold); padding-bottom: 14px; margin-bottom: 18px; }
        .sheet-head input { background: transparent; border: none; border-bottom: 1px solid var(--line); color: var(--ink); font-family: 'Cinzel', serif; font-size: 24px; padding: 4px 0; width: 260px; }
        .sheet-head input:focus { outline: none; border-color: var(--gold); }
        .sheet-sub { color: var(--ink-dim); font-size: 14px; }
        .stat-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px,1fr)); gap: 10px; margin: 16px 0; }
        .stat-pill { background: var(--bg-panel); border: 1px solid var(--line); border-radius: 4px; text-align: center; padding: 10px 4px; }
        .stat-pill .n { font-family: 'Cinzel', serif; font-size: 22px; color: var(--gold-bright); }
        .stat-pill .l { font-size: 11px; color: var(--ink-dim); text-transform: uppercase; letter-spacing: .06em; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 640px) { .two-col { grid-template-columns: 1fr; } }
        table.abtable { width: 100%; border-collapse: collapse; font-size: 14px; }
        table.abtable td, table.abtable th { padding: 6px 4px; border-bottom: 1px solid var(--line); text-align: left; }
        table.abtable th { color: var(--gold); font-family: 'Cinzel', serif; font-weight: 500; font-size: 11px; text-transform: uppercase; }
        .prof-dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; background: var(--line); }
        .prof-dot.on { background: var(--gold-bright); box-shadow: 0 0 6px var(--gold-bright); }
        ul.plain { margin: 6px 0; padding-left: 18px; }
        ul.plain li { margin-bottom: 4px; font-size: 14.5px; }

        .topbar { width: 100%; max-width: 1080px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid var(--line); }
        .topbar-title { font-family: 'Cinzel', serif; color: var(--gold-bright); font-size: 15px; letter-spacing: .06em; }
        .topbar-tabs { display: flex; flex-direction: row; gap: 8px; align-items: center; }
        .topbar-tabs button { font-family: 'Cinzel', serif; font-size: 12px; letter-spacing: .03em; padding: 7px 14px; border-radius: 18px; border: 1.5px solid var(--line); background: var(--bg-panel); color: var(--ink-dim); cursor: pointer; }
        .topbar-tabs button.on { border-color: var(--gold-bright); color: var(--ink); background: var(--bg-panel-2); }

        .char-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px,1fr)); gap: 16px; margin-top: 18px; }
        .char-card { background: var(--bg-panel); border: 1.5px solid var(--line); border-radius: 4px; padding: 16px; }
        .char-card-nome { font-family: 'Cinzel', serif; font-size: 17px; color: var(--ink); margin-bottom: 4px; }
        .char-card-meta { font-size: 13px; color: var(--ink-dim); margin-bottom: 12px; }
        .char-card-actions { display: flex; gap: 8px; }
        .btn-small { font-family: 'Cinzel', serif; font-size: 12px; padding: 6px 12px; border-radius: 3px; border: 1.5px solid var(--gold); background: transparent; color: var(--gold-bright); cursor: pointer; }
        .btn-small:hover { background: var(--gold); color: #1a1410; }
        .btn-small.danger { border-color: var(--rust); color: var(--rust-bright); }
        .btn-small.danger:hover { background: var(--rust); color: var(--ink); }
      `}</style>

      <div className="topbar">
        <div className="topbar-title">Il Sentiero dell'Eroe</div>
        <div className="topbar-tabs">
          {vista === "wizard" && (
            <span style={{ fontSize: 11.5, color: "var(--ink-dim)", marginRight: 4 }}>
              {salvataggioStato === "salvando" && "Salvataggio…"}
              {salvataggioStato === "salvato" && "Salvato ✓"}
              {salvataggioStato === "errore" && "Errore nel salvataggio"}
            </span>
          )}
          {vista === "wizard" && <button onClick={salvaPersonaggio}>💾 Salva</button>}
          <button className={vista === "wizard" ? "on" : ""} onClick={nuovoPersonaggio}>+ Nuovo personaggio</button>
          <button className={vista === "lista" ? "on" : ""} onClick={() => setVista("lista")}>I miei personaggi</button>
        </div>
      </div>

      {vista === "lista" ? (
        <div className="shell" style={{ gridTemplateColumns: "1fr" }}>
          <div className="card" style={{ gridColumn: "1 / -1" }}>
            <div className="eyebrow">Archivio</div>
            <h2 className="titolo">I miei personaggi</h2>
            <p className="sottotitolo">Personaggi salvati su questo dispositivo. Aprine uno per continuare a modificarlo o vedere la scheda.</p>
            {caricamentoLista && <div className="helper">Carico l'archivio...</div>}
            {!caricamentoLista && personaggiSalvati.length === 0 && (
              <div className="helper">Non hai ancora salvato nessun personaggio. Completane uno e premi "Salva personaggio" nell'ultimo passo.</div>
            )}
            <div className="char-grid">
              {personaggiSalvati.map((p) => {
                const sp = byId(SPECIES, p.specieId), cl = byId(CLASSES, p.classeId), bg = byId(BACKGROUNDS, p.backgroundId);
                return (
                  <div className="char-card" key={p.id}>
                    <div className="char-card-nome">{p.nome || "Senza nome"}</div>
                    <div className="char-card-meta">{[sp?.nome, cl?.nome, bg?.nome].filter(Boolean).join(" · ") || "Personaggio incompleto"}</div>
                    <div className="char-card-actions">
                      <button className="btn-small" onClick={() => caricaPersonaggio(p)}>Apri</button>
                      <button className="btn-small danger" onClick={() => eliminaPersonaggio(p.id)}>Elimina</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
      <div className="shell">
        {/* SENTIERO RUNICO — barra di progresso */}
        <div className="rail">
          <div className="rail-track" />
          <div className="rail-track-fill" style={{ height: `${(step / (STEP_DEFS.length - 1)) * 100}%` }} />
          {STEP_DEFS.map((s, i) => (
            <div key={i} className="rail-item-wrap">
              <div
                className={`rail-item ${i < step ? "done" : ""} ${i === step ? "active" : ""}`}
                onClick={() => vaiA(i)}
                title={s.label}
              >
                {s.rune}
              </div>
              <div className="rail-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="main">
          {/* STEP 0 — BENVENUTO */}
          {step === 0 && (
            <div className="card">
              <div className="eyebrow">Il Sentiero dell'Eroe</div>
              <h1 className="titolo">Forgia il tuo primo personaggio</h1>
              <p className="sottotitolo">
                Questa guida ti accompagna passo dopo passo nella creazione di un personaggio secondo le regole del
                Manuale del Giocatore 2024 — pensata per chi non ha mai giocato a Dungeons & Dragons.
                Ad ogni passo troverai spiegazioni semplici: non serve conoscere già le regole.
              </p>
              <div className="detail">
                <div className="tratto"><b>1. Specie</b><p>Chi è il tuo personaggio per nascita — umano, elfo, nano e altro — con i suoi tratti innati.</p></div>
                <div className="tratto"><b>2. Classe</b><p>Il suo mestiere d'avventuriero: come combatte e quali poteri usa.</p></div>
                <div className="tratto"><b>3. Origine (Background)</b><p>Il suo passato: da dove viene e cosa sapeva fare prima di partire per l'avventura.</p></div>
                <div className="tratto"><b>4. Punteggi di Abilità</b><p>I sei numeri che misurano corpo e mente: Forza, Destrezza, Costituzione, Intelligenza, Saggezza, Carisma.</p></div>
                <div className="tratto"><b>5. Abilità</b><p>In cosa il personaggio è particolarmente ferrato.</p></div>
                <div className="tratto"><b>6. Equipaggiamento</b><p>Cosa porta con sé all'inizio del viaggio.</p></div>
                <div className="tratto"><b>7. Storia</b><p>Chi è davvero: aspetto, personalità e il racconto della sua vita prima dell'avventura.</p></div>
                <div className="tratto"><b>8. La Scheda</b><p>Il riepilogo completo, pronto per il tavolo di gioco.</p></div>
              </div>
              <div style={{ marginTop: 20 }}>
                <span style={{ fontSize: 13, color: "var(--ink-dim)" }}>Nome del personaggio (puoi cambiarlo in ogni momento)</span>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="es. Elenya Nottealta"
                  style={{ display: "block", marginTop: 6, width: "100%", maxWidth: 360, background: "var(--bg-panel)", border: "1px solid var(--line)", borderRadius: 4, padding: "10px 12px", color: "var(--ink)", fontFamily: "Cinzel, serif" }}
                />
              </div>
              <div className="footer-nav">
                <span />
                <button className="btn primary" onClick={() => vaiA(1)}>Inizia il cammino →</button>
              </div>
            </div>
          )}

          {/* STEP 1 — SPECIE */}
          {step === 1 && (
            <div className="card">
              <div className="eyebrow">Passo 1</div>
              <h2 className="titolo">Scegli la tua specie</h2>
              <p className="sottotitolo">La specie definisce l'aspetto e i talenti innati del tuo personaggio: dimensioni, velocità e tratti speciali.</p>
              <div className="grid-cards">
                {SPECIES.map((s) => (
                  <button key={s.id} className={`choice ${specieId === s.id ? "sel" : ""}`} onClick={() => { setSpecieId(s.id); setSottospecieId(null); }}>
                    <div className="choice-top"><span className="choice-rune">{s.rune}</span><span className="choice-nome">{s.nome}</span></div>
                    <div className="choice-sub">{s.riassunto}</div>
                    <div className="choice-meta">Taglia {s.taglia}{s.altezza.startsWith("variabile") ? "" : ` (${s.altezza})`} · Velocità {metri(s.velocita)} m{s.fonte ? ` · ${s.fonte}` : ""}</div>
                  </button>
                ))}
              </div>
              {specie && (
                <div className="detail">
                  <div className="eyebrow">Tratti di {specie.nome}</div>
                  {specie.tratti.map((t, i) => (<div className="tratto" key={i}><b>{t.nome}</b><p>{t.testo}</p></div>))}

                  {specie.sottospecie && (
                    <>
                      <div className="eyebrow" style={{ marginTop: 16 }}>{specie.sottospecieLabel} — scegline uno</div>
                      <div className="bg-assign">
                        {specie.sottospecie.map((sub) => (
                          <button key={sub.id} className={`bg-pill ${sottospecieId === sub.id ? "on" : ""}`} onClick={() => setSottospecieId(sub.id)}>
                            {sub.nome}
                          </button>
                        ))}
                      </div>
                      {sottospecie && (
                        <div className="tratto"><b>{sottospecie.nome}</b><p>{sottospecie.testo}</p></div>
                      )}
                    </>
                  )}
                </div>
              )}
              <div className="footer-nav">
                <button className="btn" onClick={() => vaiA(0)}>← Indietro</button>
                <button className="btn primary" onClick={() => vaiA(2)}>Avanti →</button>
              </div>
            </div>
          )}

          {/* STEP 2 — CLASSE */}
          {step === 2 && (
            <div className="card">
              <div className="eyebrow">Passo 2</div>
              <h2 className="titolo">Scegli la tua classe</h2>
              <p className="sottotitolo">La classe determina come combatte il tuo personaggio e quali poteri speciali o magie ha a disposizione.</p>
              <div className="grid-cards">
                {CLASSES.map((c) => (
                  <button key={c.id} className={`choice ${classeId === c.id ? "sel" : ""}`} onClick={() => { setClasseId(c.id); setSkillScelte([]); setArmaMischia(null); setArmaDistanza(null); setArmaturaScelta(null); setScudoScelto(false); setPreferisceOro(false); }}>
                    <div className="choice-top"><span className="choice-rune">{c.rune}</span><span className="choice-nome">{c.nome}</span></div>
                    <div className="choice-sub">{c.riassunto}</div>
                    <div className="choice-meta">Dado Vita d{c.dado} · TS {c.ts.map(t=>ABILITIES.find(a=>a.key===t).nome).join(" e ")}</div>
                  </button>
                ))}
              </div>
              {classe && (
                <div className="detail">
                  <div className="tratto"><b>Ruolo in combattimento</b><p>{classe.ruolo}</p></div>
                  <div className="tratto"><b>Abilità</b><p>Al 1° livello scegli {classe.sceltaAbilita} abilità dalla lista della classe (le sceglierai al passo 5).</p></div>
                </div>
              )}
              <div className="footer-nav">
                <button className="btn" onClick={() => vaiA(1)}>← Indietro</button>
                <button className="btn primary" onClick={() => vaiA(3)}>Avanti →</button>
              </div>
            </div>
          )}

          {/* STEP 3 — BACKGROUND */}
          {step === 3 && (
            <div className="card">
              <div className="eyebrow">Passo 3</div>
              <h2 className="titolo">Scegli la tua origine</h2>
              <p className="sottotitolo">Il background racconta il passato del personaggio e — nelle regole 2024 — determina anche i bonus ai punteggi di abilità e un talento iniziale.</p>
              <div className="grid-cards">
                {BACKGROUNDS.map((b) => (
                  <button key={b.id} className={`choice ${backgroundId === b.id ? "sel" : ""}`} onClick={() => { setBackgroundId(b.id); setBgPiuDue(null); setBgPiuUno(null); }}>
                    <div className="choice-top"><span className="choice-rune">{b.rune}</span><span className="choice-nome">{b.nome}</span></div>
                    <div className="choice-sub">{b.riassunto}</div>
                    <div className="choice-meta">{b.abilitaPunteggi.map(k=>ABILITIES.find(a=>a.key===k).nome).join(" · ")}</div>
                  </button>
                ))}
              </div>
              {background && (
                <div className="detail">
                  <div className="tratto"><b>Competenze in abilità</b><p>{background.competenze.join(" e ")}</p></div>
                  <div className="tratto"><b>Strumento</b><p>{background.strumento}</p></div>
                  <div className="tratto"><b>Talento di Origine — {background.talento.nome}</b><p>{background.talento.testo}</p></div>

                  <div className="eyebrow" style={{ marginTop: 16 }}>Bonus ai punteggi di abilità</div>
                  <div className="method-toggle">
                    <button className={bgModo === "duePiuUno" ? "on" : ""} onClick={() => setBgModo("duePiuUno")}>+2 e +1</button>
                    <button className={bgModo === "unoUnoUno" ? "on" : ""} onClick={() => setBgModo("unoUnoUno")}>+1 / +1 / +1</button>
                  </div>
                  {bgModo === "duePiuUno" ? (
                    <>
                      <div className="helper">Scegli quale abilità riceve +2, poi quale (tra le altre due) riceve +1.</div>
                      <div className="bg-assign">
                        {background.abilitaPunteggi.map((k) => (
                          <button key={k} className={`bg-pill ${bgPiuDue === k ? "on" : ""}`} onClick={() => { setBgPiuDue(k); if (bgPiuUno === k) setBgPiuUno(null); }}>
                            {ABILITIES.find(a=>a.key===k).nome} +2
                          </button>
                        ))}
                      </div>
                      <div className="bg-assign">
                        {background.abilitaPunteggi.filter(k => k !== bgPiuDue).map((k) => (
                          <button key={k} className={`bg-pill tag2 ${bgPiuUno === k ? "on" : ""}`} onClick={() => setBgPiuUno(k)}>
                            {ABILITIES.find(a=>a.key===k).nome} +1
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="helper">Ottieni automaticamente +1 a {background.abilitaPunteggi.map(k=>ABILITIES.find(a=>a.key===k).nome).join(", ")}.</div>
                  )}
                </div>
              )}
              <div className="footer-nav">
                <button className="btn" onClick={() => vaiA(2)}>← Indietro</button>
                <button className="btn primary" onClick={() => vaiA(4)}>Avanti →</button>
              </div>
            </div>
          )}

          {/* STEP 4 — PUNTEGGI DI ABILITÀ */}
          {step === 4 && (
            <div className="card">
              <div className="eyebrow">Passo 4</div>
              <h2 className="titolo">Punteggi di abilità</h2>
              <p className="sottotitolo">Sei numeri, da 8 a 15 circa, che rappresentano corpo e mente del personaggio. Più alto il punteggio, più forte il modificatore che applicherai ai tiri di dado.</p>
              <div className="method-toggle">
                <button className={metodo === "standard" ? "on" : ""} onClick={() => setMetodo("standard")}>Array Standard (consigliato)</button>
                <button className={metodo === "pointbuy" ? "on" : ""} onClick={() => setMetodo("pointbuy")}>Acquisto Punti (avanzato)</button>
              </div>

              {metodo === "standard" ? (
                <>
                  <div className="helper">Assegna liberamente questi sei valori alle tue abilità: 15, 14, 13, 12, 10, 8.</div>
                  <div className="ability-grid">
                    {ABILITIES.map((a) => {
                      const usati = Object.entries(assegnazione).filter(([k]) => k !== a.key).map(([, v]) => v);
                      const disponibili = ARRAY_STANDARD.filter((v) => !usati.includes(v) || v === assegnazione[a.key]);
                      const finale = punteggiFinali[a.key];
                      return (
                        <div className="ab-box" key={a.key}>
                          <div className="ab-nome">{a.nome}</div>
                          <select value={assegnazione[a.key] ?? ""} onChange={(e) => setAssegnazione({ ...assegnazione, [a.key]: e.target.value ? Number(e.target.value) : null })}>
                            <option value="">—</option>
                            {disponibili.map((v) => (<option key={v} value={v}>{v}</option>))}
                          </select>
                          <div className="ab-final">{finale}{bonusBackground[a.key] ? <span style={{fontSize:12,color:"var(--gold)"}}> ({fmt(bonusBackground[a.key])})</span> : null}</div>
                          <div className="ab-mod">mod {fmt(mod(finale))}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className="helper">Hai {PUNTI_TOTALI} punti da spendere. Ogni punteggio parte da 8; salire di costo cresce più il valore è alto. Punti rimasti: <b style={{color: puntiRimasti < 0 ? "var(--rust-bright)" : "var(--gold-bright)"}}>{puntiRimasti}</b></div>
                  <div className="ability-grid">
                    {ABILITIES.map((a) => {
                      const v = pointBuy[a.key];
                      const finale = punteggiFinali[a.key];
                      return (
                        <div className="ab-box" key={a.key}>
                          <div className="ab-nome">{a.nome}</div>
                          <div className="pb-controls">
                            <button disabled={v <= 8} onClick={() => setPointBuy({ ...pointBuy, [a.key]: v - 1 })}>−</button>
                            <span style={{fontFamily:"Cinzel, serif", fontSize:18}}>{v}</span>
                            <button disabled={v >= 15 || puntiRimasti - (COSTO_PUNTI[v+1]-COSTO_PUNTI[v]) < 0} onClick={() => setPointBuy({ ...pointBuy, [a.key]: v + 1 })}>+</button>
                          </div>
                          <div className="ab-final">{finale}{bonusBackground[a.key] ? <span style={{fontSize:12,color:"var(--gold)"}}> ({fmt(bonusBackground[a.key])})</span> : null}</div>
                          <div className="ab-mod">mod {fmt(mod(finale))}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              <div className="footer-nav">
                <button className="btn" onClick={() => vaiA(3)}>← Indietro</button>
                <button className="btn primary" onClick={() => vaiA(5)}>Avanti →</button>
              </div>
            </div>
          )}

          {/* STEP 5 — ABILITÀ (skills) */}
          {step === 5 && classe && background && (
            <div className="card">
              <div className="eyebrow">Passo 5</div>
              <h2 className="titolo">Abilità</h2>
              <p className="sottotitolo">Il tuo background ti dà già due abilità. Ora scegli {classe.sceltaAbilita} abilità dalla lista della tua classe (quelle già ottenute dal background non sono selezionabili di nuovo).</p>

              <div className="eyebrow">Già ottenute dal background</div>
              <div className="skill-list">
                {background.competenze.map((s) => {
                  const sk = SKILLS.find(x=>x.nome===s);
                  return <div className="skill-item locked" key={s}>{s}<span className="ab-tag">{ABILITIES.find(a=>a.key===sk.ab).nome.slice(0,3)}</span></div>;
                })}
              </div>

              <div className="eyebrow" style={{marginTop:16}}>Scegli {classe.sceltaAbilita} dalla lista di {classe.nome} ({skillScelte.length}/{classe.sceltaAbilita})</div>
              <div className="skill-list">
                {classe.abilitaLista.filter(s => !background.competenze.includes(s)).map((s) => {
                  const sk = SKILLS.find(x=>x.nome===s);
                  const on = skillScelte.includes(s);
                  const bloccato = !on && skillScelte.length >= classe.sceltaAbilita;
                  return (
                    <div
                      key={s}
                      className={`skill-item pickable ${on ? "on" : ""} ${bloccato ? "locked" : ""}`}
                      onClick={() => {
                        if (bloccato) return;
                        setSkillScelte(on ? skillScelte.filter(x=>x!==s) : [...skillScelte, s]);
                      }}
                    >
                      {s}<span className="ab-tag">{ABILITIES.find(a=>a.key===sk.ab).nome.slice(0,3)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="footer-nav">
                <button className="btn" onClick={() => vaiA(4)}>← Indietro</button>
                <button className="btn primary" onClick={() => vaiA(6)}>Avanti →</button>
              </div>
            </div>
          )}
          {step === 5 && !(classe && background) && (
            <div className="card">
              <div className="eyebrow">Passo 5</div>
              <h2 className="titolo">Prima serve una classe e un'origine</h2>
              <p className="sottotitolo">Le abilità selezionabili dipendono dalla classe, e quelle già ottenute dipendono dal background. Completa quei passi, poi torna qui.</p>
              <div className="detail" style={{marginTop:0, borderTop:"none", paddingTop:0}}>
                <ul className="plain">
                  {!classe && <li>Classe — <span style={{color:"var(--gold-bright)", cursor:"pointer"}} onClick={() => vaiA(2)}>vai al passo 2</span></li>}
                  {!background && <li>Origine — <span style={{color:"var(--gold-bright)", cursor:"pointer"}} onClick={() => vaiA(3)}>vai al passo 3</span></li>}
                </ul>
              </div>
            </div>
          )}

          {/* STEP 6 — EQUIPAGGIAMENTO */}
          {step === 6 && classe && (
            <div className="card">
              <div className="eyebrow">Passo 6</div>
              <h2 className="titolo">Equipaggiamento iniziale</h2>
              <p className="sottotitolo">In base alle competenze del {classe.nome}, scegli le armi e l'armatura che il tuo personaggio porta con sé all'inizio del viaggio — oppure rinuncia al pacchetto e parti con dell'oro da spendere come preferisci.</p>

              <div className="method-toggle">
                <button className={!preferisceOro ? "on" : ""} onClick={() => setPreferisceOro(false)}>Pacchetto equipaggiamento</button>
                <button className={preferisceOro ? "on" : ""} onClick={() => setPreferisceOro(true)}>Oro iniziale</button>
              </div>

              {preferisceOro ? (
                <div className="detail" style={{marginTop:0, borderTop:"none", paddingTop:0}}>
                  <div className="stat-row" style={{marginTop:4}}>
                    <div className="stat-pill"><div className="n">{classe.oro} mo</div><div className="l">Dalla classe</div></div>
                    <div className="stat-pill"><div className="n">50 mo</div><div className="l">Dal background</div></div>
                    <div className="stat-pill"><div className="n">{classe.oro + 50} mo</div><div className="l">Totale da spendere</div></div>
                  </div>
                  <div className="helper">Con queste monete puoi comprare tu stesso armi, armature e altro equipaggiamento dalla lista prezzi del Manuale del Giocatore, invece di usare il pacchetto preimpostato.</div>
                </div>
              ) : (
              <>
              <div className="eyebrow">Arma da mischia</div>
              {armiMischiaDisponibili.length > 0 ? (
                <select value={armaMischia ?? ""} onChange={(e) => setArmaMischia(e.target.value || null)}
                  style={{ background: "var(--bg-panel)", border: "1px solid var(--line)", borderRadius: 4, padding: "8px 12px", color: "var(--ink)", fontFamily: "Cinzel, serif", minWidth: 240 }}>
                  <option value="">— nessuna —</option>
                  {armiMischiaDisponibili.map((a) => (<option key={a} value={a}>{a}</option>))}
                </select>
              ) : (<div className="helper">Il {classe.nome} non ha armi da mischia disponibili tra le sue competenze base.</div>)}

              <div className="eyebrow" style={{ marginTop: 16 }}>Arma a distanza (opzionale)</div>
              {armiDistanzaDisponibili.length > 0 ? (
                <select value={armaDistanza ?? ""} onChange={(e) => setArmaDistanza(e.target.value || null)}
                  style={{ background: "var(--bg-panel)", border: "1px solid var(--line)", borderRadius: 4, padding: "8px 12px", color: "var(--ink)", fontFamily: "Cinzel, serif", minWidth: 240 }}>
                  <option value="">— nessuna —</option>
                  {armiDistanzaDisponibili.map((a) => (<option key={a} value={a}>{a}</option>))}
                </select>
              ) : (<div className="helper">Il {classe.nome} non ha armi a distanza disponibili tra le sue competenze base.</div>)}

              <div className="eyebrow" style={{ marginTop: 16 }}>Armatura</div>
              {armatureDisponibili.length > 0 ? (
                <select value={armaturaScelta ?? ""} onChange={(e) => setArmaturaScelta(e.target.value || null)}
                  style={{ background: "var(--bg-panel)", border: "1px solid var(--line)", borderRadius: 4, padding: "8px 12px", color: "var(--ink)", fontFamily: "Cinzel, serif", minWidth: 240 }}>
                  <option value="">— nessuna (solo Destrezza) —</option>
                  {classe.armature.map((cat) => (
                    <optgroup label={ARMOR_CATEGORIES[cat].label} key={cat}>
                      {ARMOR_CATEGORIES[cat].items.map((a) => (<option key={a.nome} value={a.nome}>{a.nome}</option>))}
                    </optgroup>
                  ))}
                </select>
              ) : (<div className="helper">Il {classe.nome} non è competente con nessuna armatura: combatte meglio senza indossarne.</div>)}

              {classe.scudo && (
                <div style={{ marginTop: 12 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
                    <input type="checkbox" checked={scudoScelto} onChange={(e) => setScudoScelto(e.target.checked)} />
                    Impugna anche uno scudo (+2 alla Classe Armatura)
                  </label>
                </div>
              )}

              <div className="detail">
                <div className="eyebrow">Altro corredo</div>
                <ul className="plain">{EQUIPAGGIAMENTO[classe.id].map((e,i)=>(<li key={i}>{e}</li>))}</ul>
                {background && (
                  <>
                    <div className="eyebrow" style={{marginTop:14}}>Dal background</div>
                    <ul className="plain"><li>{background.strumento}</li><li>Un set da viaggiatore e qualche moneta per iniziare l'avventura</li></ul>
                  </>
                )}
              </div>
              </>
              )}
              <div className="footer-nav">
                <button className="btn" onClick={() => vaiA(5)}>← Indietro</button>
                <button className="btn primary" onClick={() => vaiA(7)}>Avanti →</button>
              </div>
            </div>
          )}
          {step === 6 && !classe && (
            <div className="card">
              <div className="eyebrow">Passo 6</div>
              <h2 className="titolo">Prima serve una classe</h2>
              <p className="sottotitolo">Le armi e le armature disponibili dipendono dalla classe scelta.</p>
              <div className="detail" style={{marginTop:0, borderTop:"none", paddingTop:0}}>
                <span style={{color:"var(--gold-bright)", cursor:"pointer"}} onClick={() => vaiA(2)}>vai al passo 2 — Classe</span>
              </div>
            </div>
          )}

          {/* STEP 7 — STORIA DEL PERSONAGGIO */}
          {step === 7 && (
            <div className="card">
              <div className="eyebrow">Passo 7</div>
              <h2 className="titolo">La storia del tuo personaggio</h2>
              <p className="sottotitolo">Questa parte è facoltativa ma dà vita al personaggio: chi è, da dove viene, cosa lo spinge ad avventurarsi. Puoi scrivere tanto o poco quanto vuoi, e tornare a modificarlo quando vuoi.</p>

              <div className="eyebrow">Aspetto fisico</div>
              <textarea value={aspetto} onChange={(e) => setAspetto(e.target.value)} placeholder="Altezza, corporatura, colore di occhi e capelli, segni particolari, modo di vestire..."
                style={{ width: "100%", minHeight: 110, background: "var(--bg-panel)", border: "1px solid var(--line)", borderRadius: 4, padding: "10px 12px", color: "var(--ink)", fontFamily: "'EB Garamond', serif", fontSize: 15, resize: "vertical" }} />

              <div className="eyebrow" style={{ marginTop: 16 }}>Tratti della personalità</div>
              <textarea value={tratti} onChange={(e) => setTratti(e.target.value)} placeholder="Come si comporta, come parla, piccole abitudini o manie..."
                style={{ width: "100%", minHeight: 110, background: "var(--bg-panel)", border: "1px solid var(--line)", borderRadius: 4, padding: "10px 12px", color: "var(--ink)", fontFamily: "'EB Garamond', serif", fontSize: 15, resize: "vertical" }} />

              <div className="eyebrow" style={{ marginTop: 16 }}>Ideali</div>
              <textarea value={ideali} onChange={(e) => setIdeali(e.target.value)} placeholder="In cosa crede fermamente, cosa lo guida..."
                style={{ width: "100%", minHeight: 90, background: "var(--bg-panel)", border: "1px solid var(--line)", borderRadius: 4, padding: "10px 12px", color: "var(--ink)", fontFamily: "'EB Garamond', serif", fontSize: 15, resize: "vertical" }} />

              <div className="eyebrow" style={{ marginTop: 16 }}>Legami</div>
              <textarea value={legami} onChange={(e) => setLegami(e.target.value)} placeholder="Persone, luoghi o oggetti a cui tiene..."
                style={{ width: "100%", minHeight: 90, background: "var(--bg-panel)", border: "1px solid var(--line)", borderRadius: 4, padding: "10px 12px", color: "var(--ink)", fontFamily: "'EB Garamond', serif", fontSize: 15, resize: "vertical" }} />

              <div className="eyebrow" style={{ marginTop: 16 }}>Difetti</div>
              <textarea value={difetti} onChange={(e) => setDifetti(e.target.value)} placeholder="Debolezze, paure, vizi..."
                style={{ width: "100%", minHeight: 90, background: "var(--bg-panel)", border: "1px solid var(--line)", borderRadius: 4, padding: "10px 12px", color: "var(--ink)", fontFamily: "'EB Garamond', serif", fontSize: 15, resize: "vertical" }} />

              <div className="eyebrow" style={{ marginTop: 16 }}>Storia (backstory)</div>
              <textarea value={backstory} onChange={(e) => setBackstory(e.target.value)} placeholder="Il racconto vero e proprio: da dove viene, cosa gli è successo, perché ha iniziato ad avventurarsi..."
                style={{ width: "100%", minHeight: 260, background: "var(--bg-panel)", border: "1px solid var(--line)", borderRadius: 4, padding: "10px 12px", color: "var(--ink)", fontFamily: "'EB Garamond', serif", fontSize: 15, resize: "vertical" }} />

              <div className="footer-nav">
                <button className="btn" onClick={() => vaiA(6)}>← Indietro</button>
                <button className="btn primary" onClick={() => vaiA(8)}>Vai alla scheda →</button>
              </div>
            </div>
          )}

          {/* STEP 8 — SCHEDA RIEPILOGO */}
          {step === 8 && specie && classe && background && (
            <div className="card sheet">
              <div className="sheet-head">
                <div>
                  <input value={nome} onChange={(e)=>setNome(e.target.value)} placeholder="Nome del personaggio" />
                  <div className="sheet-sub">{specie.nome}{sottospecie ? ` (${sottospecie.nome})` : ""} · {classe.nome} · {background.nome} · Livello 1</div>
                </div>
                <div className="sheet-sub">Bonus di competenza {fmt(profBonus)}</div>
              </div>

              <div className="stat-row">
                <div className="stat-pill"><div className="n">{hp}</div><div className="l">Punti Ferita</div></div>
                <div className="stat-pill"><div className="n">{ac}</div><div className="l">CA {armaturaScelta ? `(${armaturaScelta}${scudoScelto ? " + scudo" : ""})` : scudoScelto ? "(scudo)" : "(senza armatura)"}</div></div>
                <div className="stat-pill"><div className="n">{fmt(iniziativa)}</div><div className="l">Iniziativa</div></div>
                <div className="stat-pill"><div className="n">{metri(specie.velocita)} m</div><div className="l">Velocità</div></div>
                <div className="stat-pill"><div className="n">d{classe.dado}</div><div className="l">Dado Vita</div></div>
                <div className="stat-pill"><div className="n">{specie.taglia}</div><div className="l">Taglia{specie.altezza.startsWith("variabile") ? "" : ` (${specie.altezza})`}</div></div>
              </div>

              <div className="two-col">
                <div>
                  <div className="eyebrow">Punteggi di abilità</div>
                  <table className="abtable">
                    <thead><tr><th>Abilità</th><th>Punt.</th><th>Mod</th><th>TS</th></tr></thead>
                    <tbody>
                      {ABILITIES.map((a) => {
                        const isSave = classe.ts.includes(a.key);
                        const val = punteggiFinali[a.key];
                        const saveMod = mod(val) + (isSave ? profBonus : 0);
                        return (
                          <tr key={a.key}>
                            <td>{a.nome}</td>
                            <td>{val}</td>
                            <td>{fmt(mod(val))}</td>
                            <td><span className={`prof-dot ${isSave ? "on" : ""}`} /> {fmt(saveMod)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="eyebrow" style={{marginTop:18}}>Abilità</div>
                  <table className="abtable">
                    <tbody>
                      {[...SKILLS].sort((a,b)=>a.nome.localeCompare(b.nome)).map((sk) => {
                        const competente = background.competenze.includes(sk.nome) || skillScelte.includes(sk.nome);
                        const totale = mod(punteggiFinali[sk.ab]) + (competente ? profBonus : 0);
                        return (
                          <tr key={sk.nome}>
                            <td style={{width:16}}><span className={`prof-dot ${competente ? "on" : ""}`} /></td>
                            <td>{sk.nome}</td>
                            <td style={{color:"var(--ink-dim)", fontSize:12}}>{ABILITIES.find(a=>a.key===sk.ab).nome.slice(0,3)}</td>
                            <td style={{textAlign:"right", fontFamily:"Cinzel, serif"}}>{fmt(totale)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div>
                  <div className="eyebrow">Tratti di specie — {specie.nome}</div>
                  {specie.tratti.map((t,i)=>(<div className="tratto" key={i}><b>{t.nome}</b><p>{t.testo}</p></div>))}
                  {sottospecie && (<div className="tratto"><b>{sottospecie.nome}</b><p>{sottospecie.testo}</p></div>)}

                  <div className="eyebrow" style={{marginTop:16}}>Talento di Origine</div>
                  <div className="tratto"><b>{background.talento.nome}</b><p>{background.talento.testo}</p></div>

                  <div className="eyebrow" style={{marginTop:16}}>Ruolo di classe — {classe.nome}</div>
                  <p style={{fontSize:14.5, margin:0}}>{classe.ruolo}</p>

                  <div className="eyebrow" style={{marginTop:16}}>Equipaggiamento</div>
                  {preferisceOro ? (
                    <p style={{fontSize:14.5, margin:0}}>{classe.oro + 50} mo da spendere liberamente ({classe.oro} dalla classe + 50 dal background), invece del pacchetto preimpostato.</p>
                  ) : (
                  <ul className="plain">
                    {armaMischia && <li>{armaMischia}</li>}
                    {armaDistanza && <li>{armaDistanza}</li>}
                    {armaturaScelta && <li>{armaturaScelta}</li>}
                    {scudoScelto && <li>Scudo</li>}
                    {EQUIPAGGIAMENTO[classe.id].map((e,i)=>(<li key={i}>{e}</li>))}
                    <li>{background.strumento}</li>
                  </ul>
                  )}
                </div>
              </div>

              {(aspetto || tratti || ideali || legami || difetti || backstory) && (
                <div className="detail">
                  <div className="eyebrow">Storia del personaggio</div>
                  {aspetto && <div className="tratto"><b>Aspetto fisico</b><p>{aspetto}</p></div>}
                  {tratti && <div className="tratto"><b>Tratti della personalità</b><p>{tratti}</p></div>}
                  {ideali && <div className="tratto"><b>Ideali</b><p>{ideali}</p></div>}
                  {legami && <div className="tratto"><b>Legami</b><p>{legami}</p></div>}
                  {difetti && <div className="tratto"><b>Difetti</b><p>{difetti}</p></div>}
                  {backstory && <div className="tratto"><b>Storia</b><p style={{whiteSpace:"pre-wrap"}}>{backstory}</p></div>}
                </div>
              )}

              <div className="footer-nav">
                <button className="btn" onClick={() => vaiA(7)}>← Indietro</button>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 12.5, color: "var(--ink-dim)" }}>
                    {salvataggioStato === "salvando" && "Salvataggio in corso…"}
                    {salvataggioStato === "salvato" && "Salvato ✓"}
                    {salvataggioStato === "errore" && "Errore nel salvataggio, riprova"}
                  </span>
                  <button className="btn" onClick={() => window.print()}>Stampa scheda</button>
                  <button className="btn primary" onClick={salvaPersonaggio}>Salva personaggio</button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8 — messaggio se mancano scelte necessarie */}
          {step === 8 && !(specie && classe && background) && (
            <div className="card">
              <div className="eyebrow">Passo 8</div>
              <h2 className="titolo">Manca ancora qualcosa</h2>
              <p className="sottotitolo">Per generare la scheda servono almeno una specie, una classe e un'origine. Puoi completare i passi in qualsiasi ordine: torna a quelli mancanti quando vuoi.</p>
              <div className="detail" style={{marginTop:0, borderTop:"none", paddingTop:0}}>
                <ul className="plain">
                  {!specie && <li>Specie — <span style={{color:"var(--gold-bright)", cursor:"pointer"}} onClick={() => vaiA(1)}>vai al passo 1</span></li>}
                  {!classe && <li>Classe — <span style={{color:"var(--gold-bright)", cursor:"pointer"}} onClick={() => vaiA(2)}>vai al passo 2</span></li>}
                  {!background && <li>Origine — <span style={{color:"var(--gold-bright)", cursor:"pointer"}} onClick={() => vaiA(3)}>vai al passo 3</span></li>}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
