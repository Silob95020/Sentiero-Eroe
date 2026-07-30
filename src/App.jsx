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

/* ============================= INCANTESIMI (trucchetti + 1° livello) ============================= */

const SPELLS = [
  // TRUCCHETTI (livello 0)
  { nome: "Mage Hand (Mano Magica)", livello: 0, classi: ["bardo","mago","stregone","warlock"],
    tempo: "1 azione", gittata: "9 metri", componenti: "V, S", durata: "1 minuto",
    effetto: "Crei una mano spettrale nel punto scelto entro gittata. La mano dura per la durata o finché non la dismetti come azione, e svanisce se si trova a più di 9 metri da te. Puoi usarla per manipolare un oggetto, aprire o chiudere una porta o un contenitore non serrato, riporre o estrarre un oggetto da un contenitore aperto, o versare il contenuto di un flacone. Ogni volta che la muovi, puoi farle compiere una di queste azioni come azione bonus. La mano non può attaccare, attivare oggetti magici né trasportare più di circa 4,5 kg." },
  { nome: "Prestidigitation (Prestidigitazione)", livello: 0, classi: ["bardo","mago","stregone","warlock"],
    tempo: "1 azione", gittata: "3 metri", componenti: "V, S", durata: "Fino a 1 ora",
    effetto: "Crei uno tra diversi piccoli effetti magici nell'area: un'immagine sensoriale che sta nel palmo di una mano, una scintilla di luce o una scia di colore, un suono, un lieve odore, colorare o marchiare un piccolo oggetto, pulire o sporcare qualcosa, raffreddare, scaldare o insaporire fino a mezzo chilo di cibo o bevanda, creare una piccola decorazione non magica, oppure far apparire un piccolo simbolo luminoso su una superficie per un istante. Se lanci di nuovo il trucchetto, puoi avere fino a tre dei suoi effetti non istantanei attivi contemporaneamente." },
  { nome: "Light (Luce)", livello: 0, classi: ["bardo","chierico","mago","druido"],
    tempo: "1 azione", gittata: "Tocco", componenti: "V, M (una lucciola o del muschio fosforescente)", durata: "1 ora",
    effetto: "Tocchi un oggetto non più grande di 3 metri per lato: per la durata, l'oggetto emette luce vivida in un raggio di 6 metri e luce fioca per altri 6 oltre. La luce può essere di qualsiasi colore tu voglia. Coprire completamente l'oggetto con qualcosa di opaco blocca la luce. L'incantesimo termina se lo lanci di nuovo. Se bersagli un oggetto indossato o trasportato da una creatura ostile, questa deve superare un tiro salvezza su Destrezza per evitare l'incantesimo." },
  { nome: "Message (Messaggio)", livello: 0, classi: ["bardo","mago","stregone","druido"],
    tempo: "1 azione bonus", gittata: "36 metri", componenti: "V, S, M (un pezzo di filo di rame)", durata: "1 round",
    effetto: "Scegli una creatura che vedi entro gittata: sussurri un messaggio che solo quella creatura sente, e che può risponderti sottovoce, udibile solo da te, purché resti entro gittata. Puoi lanciare l'incantesimo attraverso oggetti solidi se conosci la posizione del bersaglio, ma 30 cm di pietra, 3 cm di metallo comune, un sottile strato di piombo o 30 cm di legno o terra bloccano l'incantesimo." },
  { nome: "Minor Illusion (Illusione Minore)", livello: 0, classi: ["bardo","mago","stregone","warlock"],
    tempo: "1 azione", gittata: "9 metri", componenti: "S, M (un pizzico di lana o capelli)", durata: "1 minuto",
    effetto: "Crei un suono o un'immagine illusoria silenziosa (non entrambi) in un punto entro gittata, che dura per la durata. L'immagine occupa al massimo un cubo di 1,5 metri di lato, non produce alcun effetto sensoriale diverso dalla vista (nessun suono, odore o altro) e si dissolve se la tocchi, a meno che tu non l'abbia già resa un ovvio inganno. Il suono può essere una voce, il ruggito di un animale o simili, a volume regolabile da un sussurro a un grido. Una creatura che usa un'azione per esaminare l'immagine può tentare una prova di Intelligenza (Indagare) contro la tua CD per riconoscerla come illusoria." },
  { nome: "Ray of Frost (Raggio di Gelo)", livello: 0, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V, S", durata: "Istantanea",
    effetto: "Un raggio di luce blu-bianca scaturisce verso una creatura entro gittata. Effettui un tiro per colpire a distanza: se colpisci, il bersaglio subisce 1d8 danni da freddo e la sua velocità si riduce di 3 metri fino all'inizio del tuo prossimo turno. Il danno aumenta di 1d8 quando raggiungi il 5° (2d8), l'11° (3d8) e il 17° livello (4d8)." },
  { nome: "Fire Bolt (Dardo di Fuoco)", livello: 0, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "36 metri", componenti: "V, S", durata: "Istantanea",
    effetto: "Scagli un dardo di fuoco contro una creatura o un oggetto entro gittata. Effettui un tiro per colpire a distanza: se colpisci, il bersaglio subisce 1d10 danni da fuoco. Un oggetto infiammabile non indossato né trasportato colpito da questo incantesimo prende fuoco, se non lo è già. Il danno aumenta di 1d10 al 5° (2d10), 11° (3d10) e 17° livello (4d10)." },
  { nome: "Chill Touch (Tocco Gelido)", livello: 0, classi: ["mago","stregone","warlock"],
    tempo: "1 azione", gittata: "36 metri", componenti: "V, S", durata: "1 round",
    effetto: "Crei una mano spettrale scheletrica nello spazio di una creatura entro gittata. Effettui un tiro per colpire a distanza: se colpisci, il bersaglio subisce 1d8 danni necrotici e non può recuperare punti ferita fino all'inizio del tuo prossimo turno. Se il bersaglio è un non morto, ha anche svantaggio ai tiri per colpire contro di te fino alla fine del tuo prossimo turno. Il danno aumenta di 1d8 al 5° (2d8), 11° (3d8) e 17° livello (4d8)." },
  { nome: "Shocking Grasp (Presa Elettrica)", livello: 0, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "Tocco", componenti: "V, S", durata: "Istantanea",
    effetto: "Elettricità scocca dalla tua mano verso una creatura che stai tentando di toccare. Hai vantaggio al tiro per colpire se il bersaglio indossa un'armatura di metallo. Se colpisci, il bersaglio subisce 1d8 danni da fulmine e non può effettuare reazioni fino all'inizio del suo prossimo turno. Il danno aumenta di 1d8 al 5° (2d8), 11° (3d8) e 17° livello (4d8)." },
  { nome: "Thaumaturgy (Taumaturgia)", livello: 0, classi: ["chierico"],
    tempo: "1 azione bonus", gittata: "9 metri", componenti: "V", durata: "Fino a 1 minuto",
    effetto: "Manifesti un lieve segno di potere sovrannaturale, scegliendo un effetto tra questi: la tua voce rimbomba per un massimo di 10 minuti senza aumentare di volume; fai vacillare, sbattere o spalancare/serrare violentemente una porta o finestra non serrata; alteri momentaneamente l'aspetto dei tuoi occhi; produci un tuono improvviso; fai vacillare una fiamma non magica o la fai avvampare/estinguere; provochi un innocuo tremore del terreno per 1 round; crei un'istantanea immagine di un simbolo religioso su una superficie. Se lanci di nuovo il trucchetto, puoi avere fino a tre dei suoi effetti non istantanei attivi insieme." },
  { nome: "Guidance (Guida)", livello: 0, classi: ["chierico","druido"],
    tempo: "1 azione bonus", gittata: "Tocco", componenti: "V, S", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Tocchi una creatura volontaria. Una volta prima della fine dell'incantesimo, il bersaglio può tirare un d4 aggiuntivo e sommarlo a una singola prova di abilità a sua scelta." },
  { nome: "Sacred Flame (Percuotere Sacro)", livello: 0, classi: ["chierico"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V, S", durata: "Istantanea",
    effetto: "Una fiamma radiosa scende su una creatura che vedi entro gittata. Il bersaglio deve superare un tiro salvezza su Destrezza o subire 1d8 danni radiosi. Il bersaglio non ottiene alcun beneficio dalla copertura parziale per questo tiro salvezza. Il danno aumenta di 1d8 al 5° (2d8), 11° (3d8) e 17° livello (4d8)." },
  { nome: "Resistance (Resistenza)", livello: 0, classi: ["chierico","druido"],
    tempo: "1 azione bonus", gittata: "Tocco", componenti: "V, S, M (un pezzetto di ferro di cavallo)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Tocchi una creatura volontaria. Una volta prima della fine dell'incantesimo, il bersaglio può tirare un d4 aggiuntivo e sommarlo a un singolo tiro salvezza a sua scelta." },
  { nome: "Thorn Whip (Sferza Spinosa)", livello: 0, classi: ["druido"],
    tempo: "1 azione", gittata: "9 metri", componenti: "V, S, M (un rametto spinoso lungo quanto la tua mano)", durata: "Istantanea",
    effetto: "Fai scattare un lungo tralcio spinoso verso una creatura entro gittata. Effettui un tiro per colpire in mischia contro il bersaglio (nonostante la gittata a distanza): se colpisci, subisce 1d6 danni perforanti e, se è di taglia Grande o inferiore, lo trascini fino a 3 metri più vicino a te. Il danno aumenta di 1d6 al 5° (2d6), 11° (3d6) e 17° livello (4d6)." },
  { nome: "Produce Flame (Produrre Fiamma)", livello: 0, classi: ["druido"],
    tempo: "1 azione", gittata: "Te stesso", componenti: "V, S", durata: "10 minuti",
    effetto: "Una fiamma danzante appare nel palmo della tua mano, emettendo luce vivida in un raggio di 3 metri e luce fioca per altri 3, e resta finché l'incantesimo dura o finché non la usi per un attacco. Puoi anche scagliarla come attacco a distanza (gittata 9 metri): effettui un tiro per colpire e, se colpisci, il bersaglio subisce 1d8 danni da fuoco. L'incantesimo termina dopo l'attacco. Il danno aumenta di 1d8 al 5° (2d8), 11° (3d8) e 17° livello (4d8)." },
  { nome: "Vicious Mockery (Bagliore Beffardo)", livello: 0, classi: ["bardo"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V", durata: "Istantanea",
    effetto: "Scagli un insulto magicamente infuso verso una creatura che senta la tua lingua entro gittata. Il bersaglio tenta un tiro salvezza su Saggezza: se fallisce, subisce 1d4 danni psichici e ha svantaggio al prossimo tiro per colpire che effettua prima della fine del suo prossimo turno, distratto dalle tue parole taglienti. Il danno aumenta di 1d4 al 5° (2d4), 11° (3d4) e 17° livello (4d4)." },
  { nome: "Friends (Amicizia)", livello: 0, classi: ["bardo","mago","stregone","warlock"],
    tempo: "1 azione", gittata: "Te stesso", componenti: "S, M (cosmetico applicato al viso prima del lancio)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Per la durata, hai vantaggio a tutte le prove di Carisma rivolte a una creatura a tua scelta che non sia ostile nei tuoi confronti. Quando l'incantesimo termina, la creatura si rende conto che sei stato magicamente influenzato a piacerle e può reagire male in base a come l'hai trattata nel frattempo. Non puoi bersagliare di nuovo la stessa creatura con questo incantesimo finché non completi un riposo lungo." },
  // INCANTESIMI DI 1° LIVELLO
  { nome: "Shield (Scudo)", livello: 1, classi: ["mago","stregone"],
    tempo: "1 reazione, quando vieni colpito da un tiro per colpire o preso di mira da Dardo Incantato", gittata: "Te stesso", componenti: "V, S", durata: "1 round",
    effetto: "Una barriera invisibile di forza magica appare a proteggerti. Fino all'inizio del tuo prossimo turno ottieni +5 alla Classe Armatura, incluso contro l'attacco che ha scatenato questo incantesimo, e non subisci alcun danno da Dardo Incantato." },
  { nome: "Magic Missile (Dardo Incantato)", livello: 1, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "36 metri", componenti: "V, S", durata: "Istantanea",
    effetto: "Crei tre dardi lucenti di energia magica. Ogni dardo colpisce automaticamente, senza bisogno di un tiro per colpire, una creatura a tua scelta che vedi entro gittata, infliggendo 1d4+1 danni da forza ciascuno. Puoi indirizzare tutti i dardi contro lo stesso bersaglio o suddividerli tra più creature. Se lanciato con uno slot di livello superiore, l'incantesimo crea un dardo aggiuntivo per ogni livello oltre il primo." },
  { nome: "Thunderwave (Onda Tonante)", livello: 1, classi: ["mago","stregone","druido","bardo"],
    tempo: "1 azione", gittata: "Te stesso (cubo di 4,5 m)", componenti: "V, S, M (un pizzico di lana o simile)", durata: "Istantanea",
    effetto: "Un'onda di forza tonante si irradia da te. Ogni creatura in un cubo di 4,5 metri di lato con origine in te deve tentare un tiro salvezza su Costituzione: se fallisce, subisce 2d8 danni da tuono e viene spinta di 3 metri lontano da te; se ha successo, subisce solo metà del danno e non viene spinta. Oggetti non ancorati e non indossati né trasportati vengono anch'essi spinti di 3 metri, e l'incantesimo genera un tuono udibile fino a 90 metri. Il danno aumenta di 1d8 per ogni slot superiore al 1°." },
  { nome: "Burning Hands (Mani Brucianti)", livello: 1, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "Te stesso (cono di 4,5 m)", componenti: "V, S", durata: "Istantanea",
    effetto: "Allarghi le dita tenendo i pollici uniti: dalle tue mani scaturisce un getto di fiamme in un cono di 4,5 metri. Ogni creatura nell'area tenta un tiro salvezza su Destrezza, subendo 3d6 danni da fuoco se fallisce, o metà se ha successo. Il fuoco incendia ogni materiale infiammabile non indossato né trasportato nell'area. Il danno aumenta di 1d6 per ogni slot superiore al 1°." },
  { nome: "Sleep (Sonno)", livello: 1, classi: ["mago","stregone","bardo"],
    tempo: "1 azione", gittata: "27 metri (sfera di 6 m di raggio)", componenti: "V, S, M (un pizzico di sabbia fine, rosa appassita o grillo vivo)", durata: "1 minuto",
    effetto: "Un incantesimo che induce un sonno magico. Tira 5d8: il totale ottenuto è il numero di punti ferita di creature che l'incantesimo può influenzare. Le creature entro 6 metri da un punto scelto entro gittata vengono considerate in ordine crescente di punti ferita attuali (ignorando i non morti e le creature immuni a essere addormentate): sottrai i punti ferita di ciascuna dal totale per determinare se cade addormentata; una creatura cade addormentata se il totale rimanente è pari o superiore ai suoi punti ferita attuali. Le creature addormentate restano tali per la durata, finché non subiscono danni o qualcuno usa un'azione per svegliarle. Slot superiori: aggiungi 2d8 al totale per ogni livello oltre il primo." },
  { nome: "Detect Magic (Individuazione del Magico)", livello: 1, classi: ["mago","stregone","chierico","druido","bardo","paladino","ranger","warlock"],
    tempo: "1 azione", gittata: "Te stesso", componenti: "V, S", durata: "Concentrazione, fino a 10 minuti",
    effetto: "Per la durata, percepisci la presenza di magia entro 9 metri da te. Se percepisci magia in questo modo, puoi usare un'azione per vedere un'aura debole intorno a qualunque creatura o oggetto visibile nell'area che porti magia, e per apprenderne la scuola di magia, se presente. L'incantesimo è bloccato da 30 cm di pietra, 3 cm di metallo comune, un sottile strato di piombo o 30 cm di legno o terra." },
  { nome: "Mage Armor (Armatura Magica)", livello: 1, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "Tocco", componenti: "V, S, M (un pezzo di pelle conciata)", durata: "8 ore",
    effetto: "Tocchi una creatura volontaria che non indossa un'armatura: fino alla fine della durata, la sua Classe Armatura base diventa 13 + il suo modificatore di Destrezza. L'incantesimo termina se il bersaglio indossa un'armatura o se tu lo dismetti come azione." },
  { nome: "Charm Person (Charme)", livello: 1, classi: ["mago","stregone","bardo","druido","warlock"],
    tempo: "1 azione", gittata: "9 metri", componenti: "V, S", durata: "1 ora",
    effetto: "Tenti di ammaliare un umanoide che vedi entro gittata. Deve tentare un tiro salvezza su Saggezza, con vantaggio se tu o i tuoi compagni state combattendo contro di lui; se fallisce, è ammaliato da te finché l'incantesimo non termina o finché tu o i tuoi compagni non gli arrecate del male. La creatura ammaliata ti considera un conoscente amichevole. Al termine della durata, il bersaglio sa di essere stato ammaliato da te. Slot superiori: puoi bersagliare una creatura aggiuntiva per ogni livello oltre il primo, purché le creature siano entro 9 metri l'una dall'altra." },
  { nome: "Cure Wounds (Cura Ferite)", livello: 1, classi: ["chierico","druido","bardo","paladino","ranger"],
    tempo: "1 azione", gittata: "Tocco", componenti: "V, S", durata: "Istantanea",
    effetto: "Una creatura che tocchi recupera un numero di punti ferita pari a 1d8 + il tuo modificatore dell'abilità da incantatore. Questo incantesimo non ha alcun effetto sui non morti né sui costrutti. Slot superiori: la cura aumenta di 1d8 per ogni livello oltre il primo." },
  { nome: "Bless (Benedizione)", livello: 1, classi: ["chierico","paladino","bardo"],
    tempo: "1 azione", gittata: "9 metri", componenti: "V, S, M (una goccia d'acqua benedetta)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Benedici fino a tre creature a tua scelta entro gittata. Ogni volta che un bersaglio effettua un tiro per colpire o un tiro salvezza prima che l'incantesimo termini, il bersaglio può tirare 1d4 e aggiungerlo al tiro. Slot superiori: puoi bersagliare una creatura in più per ogni livello oltre il primo." },
  { nome: "Command (Comando)", livello: 1, classi: ["chierico","paladino"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V", durata: "1 round",
    effetto: "Pronunci una parola di comando a una creatura che vedi entro gittata e che ti sente e comprende la tua lingua. Il bersaglio deve superare un tiro salvezza su Saggezza o seguire il comando nel suo turno successivo (esempi tipici: Avvicinati, Cadi a terra, Fuggi, Arrenditi, Fermati, ciascuno con un effetto specifico stabilito dal Master). L'incantesimo non ha alcun effetto se il bersaglio è non morto, se non comprende la tua lingua, o se il comando lo danneggerebbe direttamente. Slot superiori: puoi bersagliare una creatura in più per ogni livello oltre il primo, purché entro 9 metri l'una dall'altra al momento del lancio." },
  { nome: "Inflict Wounds (Infliggi Ferite)", livello: 1, classi: ["chierico"],
    tempo: "1 azione", gittata: "Tocco", componenti: "V, S", durata: "Istantanea",
    effetto: "Effettui un attacco in mischia con incantesimo contro una creatura che riesci a toccare. Se colpisci, il bersaglio subisce 3d10 danni necrotici. Slot superiori: il danno aumenta di 1d10 per ogni livello oltre il primo." },
  { nome: "Protection from Evil and Good (Protezione dal Bene e dal Male)", livello: 1, classi: ["chierico","paladino"],
    tempo: "1 azione", gittata: "Tocco", componenti: "V, S, M (polvere d'argento e di ferro)", durata: "Concentrazione, fino a 10 minuti",
    effetto: "Fino a quando l'incantesimo dura, una creatura volontaria che tocchi è protetta contro alcuni tipi di creature: folletti, non morti, aberrazioni, celestiali, elementali, demoni e diavoli. La protezione garantisce diversi benefici: quelle creature hanno svantaggio ai tiri per colpire contro il bersaglio; il bersaglio non può essere dominato mentalmente né spaventato da esse; se già dominato o spaventato da una di esse, il bersaglio ha vantaggio a ogni ulteriore tiro salvezza per liberarsi dell'effetto." },
  { nome: "Detect Poison and Disease (Individuazione di Veleni e Malattie)", livello: 1, classi: ["chierico","druido","ranger"],
    tempo: "1 azione", gittata: "Te stesso", componenti: "V, S, M (una foglia di agrifoglio)", durata: "Concentrazione, fino a 10 minuti",
    effetto: "Per la durata, percepisci la presenza e la posizione di veleni, creature velenose e malattie entro 9 metri da te. Percepisci anche il tipo di veleno, creatura velenosa o malattia in ciascun caso. L'incantesimo è bloccato dagli stessi materiali che bloccano Individuazione del Magico." },
  { nome: "Animal Friendship (Amicizia con gli Animali)", livello: 1, classi: ["druido","ranger"],
    tempo: "1 azione", gittata: "9 metri", componenti: "V, S, M (un biscotto o una zolletta di zucchero)", durata: "24 ore",
    effetto: "Convinci una bestia che non rappresenti una minaccia nei suoi confronti. Scegli una bestia che vedi entro gittata: se ha un valore di Intelligenza pari o superiore a 4, l'incantesimo non ha effetto. Altrimenti, deve superare un tiro salvezza su Saggezza o essere ammaliata da te per la durata. Se tu o i tuoi compagni le fate o le ordinate di fare del male, l'incantesimo termina immediatamente. Slot superiori: puoi bersagliare una bestia aggiuntiva per ogni livello oltre il primo." },
  { nome: "Hunter's Mark (Marchio del Cacciatore)", livello: 1, classi: ["ranger"],
    tempo: "1 azione bonus", gittata: "27 metri", componenti: "V", durata: "Concentrazione, fino a 1 ora",
    effetto: "Marchi una creatura che vedi entro gittata come tua preda. Fino a quando l'incantesimo dura, infliggi 1d6 danni extra al bersaglio ogni volta che lo colpisci con un attacco con arma, e hai vantaggio a qualunque prova di Saggezza (Percezione) o Saggezza (Sopravvivenza) usata per rintracciarlo. Se il bersaglio scende a 0 punti ferita prima che l'incantesimo termini, puoi usare un'azione bonus in un turno successivo per marchiare una nuova creatura. Slot superiori: la durata diventa concentrazione fino a 8 ore con uno slot di 3° o 4° livello, e fino a 24 ore con uno slot di 5° livello o superiore." },
  { nome: "Shield of Faith (Scudo della Fede)", livello: 1, classi: ["chierico","paladino"],
    tempo: "1 azione bonus", gittata: "18 metri", componenti: "V, S, M (un piccolo pezzo di pergamena con un versetto sacro)", durata: "Concentrazione, fino a 10 minuti",
    effetto: "Un campo di energia scintillante avvolge una creatura a tua scelta entro gittata, garantendole +2 alla Classe Armatura per la durata dell'incantesimo." },
  { nome: "Healing Word (Parola Guaritrice)", livello: 1, classi: ["chierico","druido","bardo"],
    tempo: "1 azione bonus", gittata: "18 metri", componenti: "V", durata: "Istantanea",
    effetto: "Una creatura a tua scelta che vedi entro gittata recupera punti ferita pari a 1d4 + il tuo modificatore dell'abilità da incantatore. Questo incantesimo non ha alcun effetto sui non morti né sui costrutti. Slot superiori: la cura aumenta di 1d4 per ogni livello oltre il primo." },
  { nome: "Dissonant Whispers (Note Dissonanti)", livello: 1, classi: ["bardo"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V", durata: "Istantanea",
    effetto: "Sussurri una frase dissonante udibile solo dal bersaglio che vedi entro gittata. Il bersaglio tenta un tiro salvezza su Saggezza: se fallisce, subisce 3d6 danni psichici e deve immediatamente usare la sua reazione, se disponibile, per allontanarsi il più possibile da te con il mezzo di movimento più veloce a disposizione, senza deliberatamente muoversi verso pericoli ovvi; se ha successo, subisce solo metà del danno e non è costretto a muoversi. Slot superiori: il danno aumenta di 1d6 per ogni livello oltre il primo." },
  { nome: "Hex (Maledizione)", livello: 1, classi: ["warlock"],
    tempo: "1 azione bonus", gittata: "27 metri", componenti: "V, S, M (pelo di gatto nero intrecciato in una corda)", durata: "Concentrazione, fino a 1 ora",
    effetto: "Maledici una creatura che vedi entro gittata. Fino a quando l'incantesimo dura, infliggi 1d6 danni necrotici extra al bersaglio ogni volta che lo colpisci con un attacco, e scegli un'abilità nel lanciare l'incantesimo: il bersaglio ha svantaggio a ogni prova effettuata con quell'abilità. Se il bersaglio scende a 0 punti ferita prima che l'incantesimo termini, puoi usare un'azione bonus in un turno successivo per maledire una nuova creatura. Slot superiori: la durata diventa concentrazione fino a 8 ore con uno slot di 3° o 4° livello, e fino a 24 ore con uno slot di 5° livello o superiore." },
  { nome: "Armor of Agathys (Armatura di Agathys)", livello: 1, classi: ["warlock"],
    tempo: "1 azione", gittata: "Te stesso", componenti: "V, S, M (una perla dal valore di almeno 10 mo, consumata dall'incantesimo)", durata: "1 ora",
    effetto: "Un guscio spettrale di gelo protettivo ti avvolge, donandoti 5 punti ferita temporanei per la durata. Se una creatura ti colpisce con un attacco in mischia mentre hai questi punti ferita temporanei, subisce 5 danni da freddo. Slot superiori: sia i punti ferita temporanei sia il danno da freddo aumentano di 5 per ogni livello oltre il primo." },

  // INCANTESIMI DI 2° LIVELLO
  { nome: "Scorching Ray (Raggio Infuocato)", livello: 2, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "36 metri", componenti: "V, S", durata: "Istantanea",
    effetto: "Crei tre raggi di fuoco e li scagli contro bersagli entro gittata, distinti o meno. Effettui un tiro per colpire a distanza per ciascun raggio: ogni raggio che colpisce infligge 2d6 danni da fuoco. Slot superiori: crei un raggio aggiuntivo per ogni livello oltre il secondo." },
  { nome: "Misty Step (Passo Nebbioso)", livello: 2, classi: ["mago","stregone","warlock"],
    tempo: "1 azione bonus", gittata: "Te stesso", componenti: "V", durata: "Istantanea",
    effetto: "Circondato da uno sbuffo di nebbia argentea, ti teletrasporti fino a 9 metri in uno spazio libero che riesci a vedere." },
  { nome: "Invisibility (Invisibilità)", livello: 2, classi: ["mago","stregone","bardo","warlock"],
    tempo: "1 azione", gittata: "Tocco", componenti: "V, S, M (un ciglio di occhio avvolto in gomma arabica)", durata: "Concentrazione, fino a 1 ora",
    effetto: "Una creatura che tocchi diventa invisibile fino alla fine dell'incantesimo: tutto ciò che indossa o trasporta è invisibile finché resta sulla sua persona. L'incantesimo termina per un bersaglio che attacca o lancia un incantesimo. Slot superiori: puoi bersagliare una creatura in più per ogni livello oltre il secondo." },
  { nome: "Web (Ragnatela)", livello: 2, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "18 metri (cubo di 6 m)", componenti: "V, S, M (un po' di ragnatela)", durata: "Concentrazione, fino a 1 ora",
    effetto: "Crei una massa di ragnatele appiccicose in un cubo di 6 metri di lato. L'area diventa terreno difficile e ogni creatura che inizia il suo turno nella ragnatela o vi entra deve tentare un tiro salvezza su Destrezza, restando intrappolata se fallisce. Una creatura intrappolata può usare la sua azione per liberarsi con una prova di Forza (Atletica) contro la tua CD. Le ragnatele sono infiammabili: un'area esposta al fuoco brucia completamente in 1 round, infliggendo 2d6 danni da fuoco a chiunque vi si trovi." },
  { nome: "Hold Person (Immobilizzare Persone)", livello: 2, classi: ["mago","stregone","bardo","chierico","warlock"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V, S, M (una piccola figura di ferro battuto)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Scegli un umanoide che vedi entro gittata: deve superare un tiro salvezza su Saggezza o essere paralizzato per la durata. Il bersaglio può ripetere il tiro salvezza alla fine di ciascuno dei suoi turni. Slot superiori: puoi bersagliare un umanoide aggiuntivo per ogni livello oltre il secondo, purché entro 9 metri l'uno dall'altro." },
  { nome: "Suggestion (Suggestione)", livello: 2, classi: ["mago","stregone","bardo","warlock"],
    tempo: "1 azione", gittata: "9 metri", componenti: "V, M (un pizzico di zucchero filato)", durata: "Concentrazione, fino a 8 ore",
    effetto: "Suggerisci un corso d'azione (limitato a poche frasi) a una creatura che vedi entro gittata e che ti sente e comprende. Deve tentare un tiro salvezza su Saggezza: se fallisce, persegue la suggestione al meglio delle sue capacità finché non è compiuta o l'incantesimo termina. La suggestione deve essere formulata in modo che l'attività sembri ragionevole; chiederle di farsi del male pone fine automaticamente all'incantesimo." },
  { nome: "Spiritual Weapon (Arma Spirituale)", livello: 2, classi: ["chierico"],
    tempo: "1 azione bonus", gittata: "18 metri", componenti: "V, S", durata: "1 minuto",
    effetto: "Crei un'arma spettrale fluttuante entro gittata che dura per la durata, oppure finché non la lanci di nuovo. Quando la crei, puoi attaccare con essa contro una creatura entro 1,5 metri da lei: effettui un tiro per colpire con incantesimo, infliggendo 1d8 + il tuo modificatore dell'abilità da incantatore danni da forza se colpisci. Come azione bonus nei turni successivi puoi muovere l'arma fino a 6 metri e ripetere l'attacco. Slot superiori: il danno aumenta di 1d8 ogni due livelli oltre il secondo." },
  { nome: "Aid (Aiuto)", livello: 2, classi: ["chierico","paladino"],
    tempo: "1 azione", gittata: "9 metri", componenti: "V, S, M (un filo d'erba nodosa)", durata: "8 ore",
    effetto: "Doni resistenza a fino a tre creature che vedi entro gittata: i loro punti ferita massimi e attuali aumentano di 5 per la durata. Slot superiori: l'aumento è di 5 punti ferita in più per ogni livello oltre il secondo." },
  { nome: "Lesser Restoration (Ripristino Inferiore)", livello: 2, classi: ["chierico","druido","paladino","ranger"],
    tempo: "1 azione", gittata: "Tocco", componenti: "V, S", durata: "Istantanea",
    effetto: "Tocchi una creatura e puoi porre fine a uno tra: una malattia, oppure una condizione tra accecato, sordo, paralizzato o avvelenato che la affligge." },
  { nome: "Moonbeam (Raggio Lunare)", livello: 2, classi: ["druido"],
    tempo: "1 azione", gittata: "36 metri (cilindro raggio 1,5 m)", componenti: "V, S, M (alcuni pezzi di guscio di ferro grezzo)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Un raggio di luce lunare pallida e fredda scende in un cilindro di 1,5 metri di raggio e 12 di altezza, centrato su un punto entro gittata. Ogni creatura in quell'area quando lanci l'incantesimo, e ogni creatura che vi entra o vi termina il turno, deve tentare un tiro salvezza su Costituzione, subendo 2d10 danni radiosi se fallisce (metà se ha successo). Come azione puoi spostare il raggio fino a 18 metri. Slot superiori: il danno aumenta di 1d10 per ogni livello oltre il secondo." },
  { nome: "Pass without Trace (Passare Senza Lasciare Traccia)", livello: 2, classi: ["druido","ranger"],
    tempo: "1 azione", gittata: "Te stesso", componenti: "V, S, M (cenere e foglie fresche di ontano)", durata: "Concentrazione, fino a 1 ora",
    effetto: "Un velo d'ombra e silenzio emana da te, avvolgendo le creature a tua scelta entro 9 metri per la durata. Le creature avvolte ottengono +10 alle prove di Destrezza (Furtività) e non possono essere tracciate se non per mezzi magici. Anche le loro tracce fisiche scompaiono." },
  { nome: "Zone of Truth (Zona di Verità)", livello: 2, classi: ["chierico","paladino","bardo"],
    tempo: "1 azione", gittata: "18 metri (sfera raggio 4,5 m)", componenti: "V, S", durata: "10 minuti",
    effetto: "Crei un'area magica che rileva le menzogne in una sfera di 4,5 metri di raggio centrata su un punto entro gittata. Una creatura che entra nell'area o inizia lì il suo turno deve tentare un tiro salvezza su Carisma: se fallisce, non può dire deliberatamente il falso per la durata, purché resti nell'area. Le creature consapevoli dell'incantesimo possono evitarlo semplicemente evitando affermazioni dirette o eludendo la verità senza mentire apertamente." },
  { nome: "Flaming Sphere (Sfera Fiammeggiante)", livello: 2, classi: ["mago","druido"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V, S, M (una candela di cera e sego)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Una sfera di fuoco di 1,5 metri di diametro appare in uno spazio libero entro gittata e dura per la durata. Ogni creatura che finisce il turno entro 1,5 metri da essa deve tentare un tiro salvezza su Destrezza, subendo 2d6 danni da fuoco se fallisce (metà se ha successo). Come azione bonus puoi muovere la sfera fino a 9 metri; farla passare attraverso lo spazio di una creatura le impone lo stesso tiro salvezza. Slot superiori: il danno aumenta di 1d6 per ogni livello oltre il secondo." },

  // INCANTESIMI DI 3° LIVELLO
  { nome: "Fireball (Palla di Fuoco)", livello: 3, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "45 metri (sfera raggio 6 m)", componenti: "V, S, M (una pallina di guano di pipistrello e zolfo)", durata: "Istantanea",
    effetto: "Una scintilla scaturisce dal tuo dito verso un punto entro gittata, dove esplode con un ruggito basso in una sfera di fuoco di 6 metri di raggio. Ogni creatura nell'area deve tentare un tiro salvezza su Destrezza, subendo 8d6 danni da fuoco se fallisce (metà se ha successo). Il fuoco incendia materiali infiammabili non indossati né trasportati nell'area. Slot superiori: il danno aumenta di 1d6 per ogni livello oltre il terzo." },
  { nome: "Lightning Bolt (Fulmine)", livello: 3, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "Te stesso (linea 30x1,5 m)", componenti: "V, S, M (un po' di pelliccia e un'asta di vetro o ambra)", durata: "Istantanea",
    effetto: "Una linea di folgore lampeggiante di 30 metri per 1,5 di larghezza si irradia da te in una direzione a tua scelta. Ogni creatura nella linea deve tentare un tiro salvezza su Destrezza, subendo 8d6 danni da fulmine se fallisce (metà se ha successo). Il fulmine incendia materiali infiammabili non indossati né trasportati nell'area. Slot superiori: il danno aumenta di 1d6 per ogni livello oltre il terzo." },
  { nome: "Counterspell (Contro-incantesimo)", livello: 3, classi: ["mago","stregone","warlock"],
    tempo: "1 reazione, quando vedi una creatura entro 18 metri lanciare un incantesimo", gittata: "18 metri", componenti: "S", durata: "Istantanea",
    effetto: "Tenti di interrompere una creatura nel processo di lanciare un incantesimo. Se la creatura sta lanciando un incantesimo di 3° livello o inferiore, il suo incantesimo fallisce senza alcun effetto. Se sta lanciando un incantesimo di 4° livello o superiore, effettui una prova della tua abilità da incantatore contro una CD pari a 10 + il livello dell'incantesimo: se ha successo, l'incantesimo della creatura fallisce senza effetto." },
  { nome: "Fly (Volare)", livello: 3, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "Tocco", componenti: "V, S, M (una piuma di uccello)", durata: "Concentrazione, fino a 10 minuti",
    effetto: "Tocchi una creatura volontaria: per la durata, quella creatura ottiene una velocità di volo di 18 metri. Quando l'incantesimo termina, se il bersaglio è ancora in volo, scende, a meno che non sia in grado di fermare la caduta. Slot superiori: puoi bersagliare una creatura aggiuntiva per ogni livello oltre il terzo." },
  { nome: "Haste (Fretta)", livello: 3, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "9 metri", componenti: "V, S, M (un pezzetto di pelo di sciacallo)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Scegli una creatura volontaria che vedi entro gittata: fino alla fine dell'incantesimo, la sua velocità raddoppia, ottiene +2 alla Classe Armatura, ha vantaggio ai tiri salvezza su Destrezza, e riceve un'azione aggiuntiva ogni suo turno (utilizzabile solo per Attacco, Scattare, Schivare, Disingaggiare, Nascondersi o Usare Oggetto). Quando l'incantesimo termina, il bersaglio non può muoversi né agire fino al termine del suo turno successivo, colto da un momento di letargia." },
  { nome: "Dispel Magic (Rimozione Magie)", livello: 3, classi: ["mago","stregone","chierico","druido","bardo","paladino","warlock"],
    tempo: "1 azione", gittata: "36 metri", componenti: "V, S", durata: "Istantanea",
    effetto: "Scegli una creatura, un oggetto o un effetto magico entro gittata: ogni incantesimo di 3° livello o inferiore attivo sul bersaglio termina. Per ogni incantesimo di livello 4° o superiore sul bersaglio, effettua una prova della tua abilità da incantatore (CD 10 + livello dell'incantesimo): se ha successo, quell'incantesimo termina. Slot superiori: rimuovi automaticamente incantesimi fino al livello dello slot usato, senza bisogno di prova." },
  { nome: "Revivify (Rianimare)", livello: 3, classi: ["chierico","paladino"],
    tempo: "1 azione", gittata: "Tocco", componenti: "V, S, M (diamanti dal valore di almeno 300 mo, consumati)", durata: "Istantanea",
    effetto: "Tocchi una creatura morta da non più di 1 minuto: quella creatura torna in vita con 1 punto ferita. Questo incantesimo non può riportare in vita una creatura morta per vecchiaia, né ripristinare parti del corpo mancanti." },
  { nome: "Spirit Guardians (Guardiani Spirituali)", livello: 3, classi: ["chierico"],
    tempo: "1 azione", gittata: "Te stesso (raggio 4,5 m)", componenti: "V, S, M (un simbolo sacro)", durata: "Concentrazione, fino a 10 minuti",
    effetto: "Spiriti simili a fantasmi vorticano intorno a te per la durata, in un raggio di 4,5 metri. Puoi sceglierli benevoli o malevoli nell'aspetto. Ogni creatura di tua scelta che entra nell'area per la prima volta in un turno o vi inizia il turno deve tentare un tiro salvezza su Saggezza, subendo 3d8 danni radiosi o necrotici (a tua scelta) se fallisce, metà se ha successo. L'area conta come terreno difficile per i tuoi nemici. Slot superiori: il danno aumenta di 1d8 per ogni livello oltre il terzo." },
  { nome: "Beacon of Hope (Faro di Speranza)", livello: 3, classi: ["chierico"],
    tempo: "1 azione", gittata: "9 metri", componenti: "V, S", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Doni speranza e vigore a chi ti circonda. Scegli qualunque numero di creature entro gittata: per la durata, ciascuna ha vantaggio ai tiri salvezza su Saggezza e alle prove per stabilizzarsi quando è morente, e recupera il massimo possibile da qualunque cura magica ricevuta." },
  { nome: "Call Lightning (Richiamare il Fulmine)", livello: 3, classi: ["druido"],
    tempo: "1 azione", gittata: "36 metri", componenti: "V, S", durata: "Concentrazione, fino a 10 minuti",
    effetto: "Una nube temporalesca appare in un punto scelto sopra di te, entro gittata. Quando lanci l'incantesimo e come azione in ogni tuo turno successivo, puoi far scoccare un fulmine dalla nube su un punto entro 36 metri sotto di essa: ogni creatura entro 1,5 metri da quel punto tenta un tiro salvezza su Destrezza, subendo 3d10 danni da fulmine se fallisce (metà se ha successo). All'aperto in condizioni di tempesta, il danno di ogni fulmine sale a 4d10. Slot superiori: il danno aumenta di 1d10 per ogni livello oltre il terzo." },
  { nome: "Conjure Animals (Evocare Animali)", livello: 3, classi: ["druido","ranger"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V, S", durata: "Concentrazione, fino a 1 ora",
    effetto: "Evochi spiriti che assumono la forma di bestie nello spazio libero entro gittata: scegli una tra alcune combinazioni (ad esempio un'unica bestia di sfida 2 o inferiore, due bestie di sfida 1 o inferiore, quattro di sfida 1/2 o inferiore, oppure otto di sfida 1/4 o inferiore). Ogni bestia evocata è amichevole verso di te e i tuoi compagni e obbedisce ai tuoi comandi verbali. Le bestie svaniscono quando raggiungono 0 punti ferita o quando l'incantesimo termina. Slot superiori: evochi il doppio delle bestie per ogni due livelli oltre il terzo." },
  { nome: "Hypnotic Pattern (Motivo Ipnotico)", livello: 3, classi: ["bardo","mago","stregone","warlock"],
    tempo: "1 azione", gittata: "36 metri (cubo di 9 m)", componenti: "S, M (un pizzico di sabbia colorata o incenso e mica finemente tritati)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Crei un motivo ipnotico di colori intreccianti che appare in un cubo di 9 metri di lato entro gittata. Ogni creatura nell'area quando l'incantesimo viene lanciato deve tentare un tiro salvezza su Saggezza: se fallisce, resta ammaliata per la durata, incapacitata e con velocità 0. L'effetto termina per una creatura se subisce danni o se qualcuno usa un'azione per scuoterla." },

  // INCANTESIMI DI 4° LIVELLO
  { nome: "Greater Invisibility (Invisibilità Superiore)", livello: 4, classi: ["mago","stregone","bardo"],
    tempo: "1 azione", gittata: "Tocco", componenti: "V, S", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Tocchi una creatura volontaria: diventa invisibile per la durata, anche mentre attacca o lancia incantesimi (a differenza dell'invisibilità normale, l'effetto non termina in questi casi)." },
  { nome: "Ice Storm (Tempesta di Ghiaccio)", livello: 4, classi: ["mago","druido"],
    tempo: "1 azione", gittata: "90 metri (cilindro raggio 6 m)", componenti: "V, S, M (un pizzico di polvere e qualche goccia d'acqua)", durata: "Istantanea",
    effetto: "Una violenta grandinata cade in un cilindro di 6 metri di raggio e 12 di altezza centrato su un punto entro gittata. Ogni creatura nell'area tenta un tiro salvezza su Destrezza, subendo 2d8 danni contundenti e 4d6 danni da freddo se fallisce (metà se ha successo). Il terreno nell'area diventa difficile fino alla fine del tuo prossimo turno. Slot superiori: il danno contundente aumenta di 1d8 per ogni livello oltre il quarto." },
  { nome: "Polymorph (Polimorfismo)", livello: 4, classi: ["mago","stregone","druido","bardo"],
    tempo: "1 azione", gittata: "27 metri", componenti: "V, S, M (un bozzolo appena mutato di una farfalla)", durata: "Concentrazione, fino a 1 ora",
    effetto: "Trasformi una creatura che vedi entro gittata in una nuova forma di bestia. Un bersaglio non consenziente tenta un tiro salvezza su Saggezza per resistere. La nuova forma può essere qualunque bestia con un valore di sfida pari o inferiore al livello del bersaglio (o alla sua sfida, se maggiore). Il bersaglio assume i punteggi fisici e le capacità della nuova forma ma mantiene mente, personalità e capacità di parlare se le aveva. Il bersaglio riporta i suoi punti ferita alla forma originale quando la trasformazione termina, restando tale finché non subisce danni sufficienti nella nuova forma a ridurla a 0 pf, quando l'incantesimo termina o quando usa la sua azione per farlo terminare." },
  { nome: "Banishment (Bando)", livello: 4, classi: ["mago","stregone","chierico","paladino","warlock"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V, S, M (un frammento di conchiglia)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Tenti di mandare una creatura che vedi entro gittata in un'altra dimensione. Il bersaglio tenta un tiro salvezza su Carisma: se fallisce, viene trasposto in una tasca dimensionale innocua per la durata; se è nativo di un altro piano di esistenza rispetto a quello in cui ti trovi, viene invece bandito lì permanentemente se l'incantesimo dura fino alla fine. Slot superiori: puoi bersagliare una creatura in più per ogni livello oltre il quarto." },
  { nome: "Wall of Fire (Muro di Fuoco)", livello: 4, classi: ["mago","stregone","druido"],
    tempo: "1 azione", gittata: "36 metri", componenti: "V, S, M (un pezzetto di fosforo)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Crei un muro di fuoco su una superficie solida entro gittata: può formare una linea lunga fino a 18 metri, alta 6 e spessa 30 cm, oppure un anello di 6 metri di diametro, alto 6 e spesso 30 cm. Scegli un lato del muro: ogni creatura in quel lato entro 3 metri dal muro subisce 5d8 danni da fuoco quando il muro appare; ogni creatura che termina il turno entro 3 metri dal muro sul lato scelto o che entra per la prima volta nel muro in un turno subisce 5d8 danni da fuoco. Slot superiori: il danno aumenta di 1d8 per ogni livello oltre il quarto." },
  { nome: "Guardian of Faith (Guardiano della Fede)", livello: 4, classi: ["chierico"],
    tempo: "1 azione", gittata: "9 metri", componenti: "V", durata: "8 ore",
    effetto: "Un guardiano spettrale grande quanto un'armatura appare ed è a guardia entro 3 metri da un punto scelto entro gittata per la durata. Ogni creatura ostile che si muove per la prima volta in un turno entro 3 metri dal guardiano deve tentare un tiro salvezza su Destrezza, subendo 20 danni radiosi se fallisce (metà se ha successo). Il guardiano svanisce quando ha inflitto un totale di 60 danni." },
  { nome: "Death Ward (Salvaguardia dalla Morte)", livello: 4, classi: ["chierico","paladino"],
    tempo: "1 azione", gittata: "Tocco", componenti: "V, S", durata: "8 ore",
    effetto: "Tocchi una creatura e le doni protezione dalla morte. La prima volta che il bersaglio subirebbe danni sufficienti a ridurlo a 0 punti ferita, invece scende a 1 punto ferita, e l'incantesimo termina. Se il bersaglio subisce danni normalmente fatali senza essere ridotto a 0 pf, l'incantesimo non ha effetto in quel caso." },
  { nome: "Freedom of Movement (Libertà di Movimento)", livello: 4, classi: ["chierico","druido","ranger","bardo"],
    tempo: "1 azione", gittata: "Tocco", componenti: "V, S, M (un bracciale di cuoio)", durata: "8 ore",
    effetto: "Tocchi una creatura volontaria: per la durata, i suoi movimenti non sono ostacolati da terreno difficile e incantesimi ed effetti magici non possono ridurne la velocità né restrainarla, paralizzarla o intrappolarla. Può inoltre spendere 1,5 metri di movimento per liberarsi automaticamente da manette non magiche o simili restrizioni." },
  { nome: "Confusion (Confusione)", livello: 4, classi: ["mago","stregone","bardo","druido"],
    tempo: "1 azione", gittata: "27 metri (sfera raggio 4,5 m)", componenti: "V, S, M (tre noci)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Questo incantesimo confonde le menti delle creature in un'area sferica di 4,5 metri di raggio centrata su un punto entro gittata. Ogni creatura nell'area deve tentare un tiro salvezza su Saggezza; se fallisce, non può agire normalmente e, tirando ogni turno, si muove in direzione casuale, resta ferma, attacca la creatura più vicina o agisce normalmente, finché non è più nell'area o l'incantesimo termina, potendo ripetere il tiro salvezza alla fine di ogni suo turno." },

  // INCANTESIMI DI 5° LIVELLO
  { nome: "Cone of Cold (Cono di Freddo)", livello: 5, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "Te stesso (cono di 18 m)", componenti: "V, S, M (una piccola sfera di cristallo o vetro)", durata: "Istantanea",
    effetto: "Un'esplosione di aria gelida irrompe da te in un cono di 18 metri. Ogni creatura nell'area tenta un tiro salvezza su Costituzione, subendo 8d8 danni da freddo se fallisce (metà se ha successo). Una creatura uccisa da questo incantesimo diventa una statua di ghiaccio scolpita finché il ghiaccio non si scioglie. Slot superiori: il danno aumenta di 1d8 per ogni livello oltre il quinto." },
  { nome: "Wall of Force (Muro di Forza)", livello: 5, classi: ["mago"],
    tempo: "1 azione", gittata: "36 metri", componenti: "V, S, M (un pizzico di polvere di diamante)", durata: "Concentrazione, fino a 10 minuti",
    effetto: "Crei un muro invisibile di forza in un punto entro gittata: può assumere la forma di fino a dieci pannelli di 3 metri per 3 ciascuno, oppure una sfera o emisfero di 6 metri di diametro al massimo. Il muro è completamente invisibile e nulla può passarvi fisicamente attraverso: blocca anche il teletrasporto e i viaggi extradimensionali. È immune ai danni ed è indistruttibile con la maggior parte dei mezzi convenzionali." },
  { nome: "Teleportation Circle (Circolo di Teletrasporto)", livello: 5, classi: ["mago"],
    tempo: "1 minuto", gittata: "3 metri", componenti: "V, M (polveri rare e incenso dal valore complessivo di 50 mo, consumati)", durata: "1 round",
    effetto: "Disegni un cerchio di teletrasporto sul terreno che, se conosci il sigillo di destinazione di un altro cerchio permanente, apre un portale collegato a esso: qualunque creatura che entri nel portale entro la durata viene trasportata istantaneamente alla destinazione." },
  { nome: "Hold Monster (Immobilizzare Mostro)", livello: 5, classi: ["mago","stregone","bardo","warlock"],
    tempo: "1 azione", gittata: "27 metri", componenti: "V, S, M (un pezzo di corda ricurva)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Scegli una creatura che vedi entro gittata: deve superare un tiro salvezza su Saggezza o essere paralizzata per la durata (i non morti sono immuni). Il bersaglio può ripetere il tiro salvezza alla fine di ciascuno dei suoi turni. Slot superiori: puoi bersagliare una creatura aggiuntiva per ogni livello oltre il quinto." },
  { nome: "Dominate Person (Dominare Persona)", livello: 5, classi: ["mago","stregone","bardo"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V, S", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Tenti di affascinare un umanoide che vedi entro gittata, prendendone il controllo mentale. Deve tentare un tiro salvezza su Saggezza (con vantaggio se tu o i tuoi compagni siete in combattimento con lui): se fallisce, è dominato da te per la durata, durante la quale hai un legame telepatico con lui finché siete sullo stesso piano di esistenza e puoi usare la tua azione per dirigere le sue azioni. Slot superiori: la durata aumenta a concentrazione fino a 10 minuti con uno slot di 6° livello, o fino a 8 ore con uno slot di 7° livello o superiore." },
  { nome: "Greater Restoration (Ripristino Superiore)", livello: 5, classi: ["chierico","druido","bardo"],
    tempo: "1 azione", gittata: "Tocco", componenti: "V, S, M (diamanti dal valore di almeno 100 mo, consumati)", durata: "Istantanea",
    effetto: "Tocchi una creatura e puoi porre fine a uno tra questi effetti che la affligge: un livello di spossatezza, una riduzione di un punteggio di caratteristica, una riduzione dei punti ferita massimi, oppure un effetto che la trasforma contro la sua volontà o la tiene paralizzata, pietrificata o dominata mentalmente." },
  { nome: "Mass Cure Wounds (Cura Ferite di Massa)", livello: 5, classi: ["chierico","druido","bardo"],
    tempo: "1 azione", gittata: "18 metri (sfera raggio 9 m)", componenti: "V, S", durata: "Istantanea",
    effetto: "Un'ondata di energia curativa si irradia dal punto scelto entro gittata: fino a sei creature a tua scelta in una sfera di 9 metri di raggio centrata su quel punto recuperano punti ferita pari a 3d8 + il tuo modificatore dell'abilità da incantatore. L'incantesimo non ha effetto sui non morti né sui costrutti. Slot superiori: la cura aumenta di 1d8 per ogni livello oltre il quinto." },
  { nome: "Flame Strike (Colonna di Fuoco)", livello: 5, classi: ["chierico"],
    tempo: "1 azione", gittata: "18 metri (cilindro raggio 3 m)", componenti: "V, S, M (zolfo)", durata: "Istantanea",
    effetto: "Una colonna di fuoco divino si abbatte da sopra in un cilindro di 3 metri di raggio e 12 di altezza centrato su un punto entro gittata. Ogni creatura nell'area tenta un tiro salvezza su Destrezza, subendo 4d6 danni da fuoco e 4d6 danni radiosi se fallisce (metà se ha successo). Slot superiori: uno dei due tipi di danno (a tua scelta al lancio) aumenta di 1d6 per ogni livello oltre il quinto." },
  { nome: "Insect Plague (Piaga d'Insetti)", livello: 5, classi: ["druido"],
    tempo: "1 azione", gittata: "90 metri (sfera raggio 6 m)", componenti: "V, S, M (una cavalletta morta)", durata: "Concentrazione, fino a 10 minuti",
    effetto: "Una nube ronzante di insetti affamati e mordaci riempie una sfera di 6 metri di raggio centrata su un punto entro gittata: l'area è oscurata debolmente e conta come terreno difficile. Quando l'area appare, ogni creatura al suo interno tenta un tiro salvezza su Costituzione, subendo 4d10 danni perforanti se fallisce (metà se ha successo); una creatura subisce lo stesso danno se termina il suo turno nell'area. Slot superiori: il danno aumenta di 1d10 per ogni livello oltre il quinto." },
  { nome: "Conjure Elemental (Evocare Elementale)", livello: 5, classi: ["druido"],
    tempo: "1 minuto", gittata: "27 metri (cerchio raggio 3 m)", componenti: "V, S, M (incenso bruciato)", durata: "Concentrazione, fino a 1 ora",
    effetto: "Chiami uno spirito elementale che assume la forma di una creatura elementale con un valore di sfida pari a 5 o inferiore, appropriata al luogo (fuoco vicino a fiamme, acqua vicino a un lago, e così via). L'elementale appare in uno spazio libero entro 3 metri da un punto scelto entro gittata ed è amichevole verso di te e i tuoi compagni, obbedendo ai tuoi comandi verbali. Svanisce quando raggiunge 0 punti ferita o quando l'incantesimo termina." },

  // INCANTESIMI DI 6° LIVELLO
  { nome: "Disintegrate (Disintegrare)", livello: 6, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V, S, M (una calamita e un pizzico di polvere)", durata: "Istantanea",
    effetto: "Un sottile raggio verde-nero scaturisce verso una creatura o un oggetto che vedi entro gittata. Il bersaglio deve tentare un tiro salvezza su Destrezza: se fallisce, subisce 10d6+40 danni da forza. Se questo danno riduce il bersaglio a 0 punti ferita, viene disintegrato in una fine polvere grigia, e può essere riportato in vita solo con un incantesimo che ripristini vita da un semplice frammento di corpo. L'incantesimo può anche disintegrare un grande oggetto non magico o una porzione di uno più grande. Slot superiori: il danno aumenta di 3d6 per ogni livello oltre il sesto." },
  { nome: "Chain Lightning (Catena di Fulmini)", livello: 6, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "45 metri", componenti: "V, S, M (un pezzo di pelliccia, ambra, vetro o un cristallo, e tre aghi d'argento)", durata: "Istantanea",
    effetto: "Crei un fulmine che scocca verso un bersaglio a tua scelta che vedi entro gittata, per poi saltare fino a tre bersagli aggiuntivi, ciascuno entro 9 metri dal precedente. Ogni bersaglio tenta un tiro salvezza su Destrezza, subendo 10d8 danni da fulmine se fallisce (metà se ha successo). Slot superiori: crei un fulmine aggiuntivo per ogni livello oltre il sesto." },
  { nome: "True Seeing (Vista Autentica)", livello: 6, classi: ["mago","stregone","chierico","bardo","warlock"],
    tempo: "1 azione", gittata: "Tocco", componenti: "V, S, M (un unguento per gli occhi dal valore di 25 mo, ricavato da fiori di zafferano)", durata: "1 ora",
    effetto: "Tocchi una creatura volontaria e le doni la capacità di vedere le cose come realmente sono. Per la durata, il bersaglio ha scurovisione fino a 36 metri, può vedere attraverso l'oscurità magica, automaticamente individua illusioni e ne ha successo automatico ai relativi tiri salvezza, vede la forma reale di creature mutaforma o trasformate, e può vedere nel Piano Etereo." },
  { nome: "Heal (Guarigione)", livello: 6, classi: ["chierico","druido"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V, S", durata: "Istantanea",
    effetto: "Un'ondata di energia curativa scorre attraverso una creatura che vedi entro gittata, ripristinandole 70 punti ferita. Questo incantesimo pone inoltre fine a cecità, sordità e qualunque malattia che affligge il bersaglio. Non ha effetto sui costrutti né sui non morti. Slot superiori: la cura aumenta di 10 punti ferita per ogni livello oltre il sesto." },
  { nome: "Heroes' Feast (Banchetto degli Eroi)", livello: 6, classi: ["chierico","bardo"],
    tempo: "1 ora", gittata: "Te stesso (raggio 9 m)", componenti: "V, S, M (un servizio da tavola dal valore di almeno 1.000 mo, consumato dall'incantesimo)", durata: "Istantanea",
    effetto: "Evochi un festino sontuoso, sostentamento sufficiente per fino a dodici creature. Le creature che vi partecipano guadagnano diversi benefici che durano 24 ore: immunità al veleno e alla condizione avvelenato, un massimo di punti ferita che aumenta di 2d10 e altrettanti punti ferita guadagnati, e vantaggio ai tiri salvezza su Saggezza e contro l'essere spaventate." },
  { nome: "Circle of Death (Cerchio di Morte)", livello: 6, classi: ["mago","stregone","warlock"],
    tempo: "1 azione", gittata: "45 metri (sfera raggio 18 m)", componenti: "V, S, M (polvere composta da ossa nere, dal valore di 500 mo)", durata: "Istantanea",
    effetto: "Un'onda di energia negativa si irradia in una sfera di 18 metri di raggio centrata su un punto entro gittata. Ogni creatura in quell'area deve tentare un tiro salvezza su Costituzione, subendo 8d6 danni necrotici se fallisce (metà se ha successo). Slot superiori: il danno aumenta di 2d6 per ogni livello oltre il sesto." },
  { nome: "Sunbeam (Raggio di Sole)", livello: 6, classi: ["druido"],
    tempo: "1 azione", gittata: "Te stesso (linea 18x1,5 m)", componenti: "V, S, M (una lente convessa)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Un raggio di luce brillante scaturisce da te in una linea di 18 metri per 1,5 di larghezza. Ogni creatura nella linea tenta un tiro salvezza su Costituzione, subendo 6d8 danni radiosi e restando accecata fino al tuo turno successivo se fallisce (metà danno e nessun accecamento se ha successo); i non morti e i costrutti animati da vita vegetale hanno svantaggio a questo tiro salvezza. Puoi ripetere l'attacco come azione in ogni tuo turno successivo, finché l'incantesimo dura. Per la durata, un raggio di luce fioca si irradia da te, che conta come luce del sole. Slot superiori: il danno aumenta di 1d8 per ogni livello oltre il sesto." },
  { nome: "Mass Suggestion (Suggestione di Massa)", livello: 6, classi: ["bardo","mago","stregone","warlock"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V, M (un pizzico di zucchero filato)", durata: "24 ore",
    effetto: "Suggerisci un corso d'azione (limitato a poche frasi) a un massimo di dodici creature che vedi entro gittata e che ti sentono e comprendono. Le creature che falliscono un tiro salvezza su Saggezza perseguono la suggestione al meglio delle loro capacità finché non è compiuta o l'incantesimo termina, similmente a Suggestione ma con più bersagli e durata più lunga." },
  { nome: "Wall of Ice (Muro di Ghiaccio)", livello: 6, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "36 metri", componenti: "V, S, M (un pezzetto di quarzo)", durata: "Concentrazione, fino a 10 minuti",
    effetto: "Crei un muro di ghiaccio su una superficie solida entro gittata: può formare una linea lunga fino a 3 metri per livello dello slot, alta 3 metri e spessa 30 cm, oppure una cupola o sfera di diametro pari a un terzo della lunghezza massima. Ogni creatura nell'area dove appare il muro tenta un tiro salvezza su Destrezza, subendo 10d6 danni da freddo se fallisce (metà se ha successo). Il muro e l'area intorno diventano gelidi finché l'incantesimo dura. Slot superiori: il danno aumenta di 2d6 e la lunghezza consentita del muro aumenta per ogni livello oltre il sesto." },

  // INCANTESIMI DI 7° LIVELLO
  { nome: "Finger of Death (Dito della Morte)", livello: 7, classi: ["mago","stregone","warlock"],
    tempo: "1 azione", gittata: "36 metri", componenti: "V, S, M", durata: "Istantanea",
    effetto: "Scagli energia negativa verso una creatura che vedi entro gittata, tentando di stroncarne la vita in un istante. Il bersaglio deve tentare un tiro salvezza su Costituzione, subendo 7d8+30 danni necrotici se fallisce (metà se ha successo). Un umanoide ucciso da questo incantesimo si rialza all'inizio del tuo turno successivo come uno zombie sotto il tuo controllo permanente." },
  { nome: "Teleport (Teletrasporto)", livello: 7, classi: ["mago","bardo"],
    tempo: "1 azione", gittata: "Tocco", componenti: "V", durata: "Istantanea",
    effetto: "Questo incantesimo trasporta istantaneamente te e fino a otto creature volontarie che ti tengono per mano, o un singolo oggetto che tocchi, verso una destinazione a tua scelta sullo stesso piano di esistenza. Il grado di conoscenza che hai della destinazione determina quanto è preciso l'arrivo: una conoscenza perfetta (essere già stato lì spesso) garantisce l'arrivo esatto, mentre destinazioni conosciute solo per descrizione o visitate raramente comportano un rischio crescente di arrivare in un punto vicino, o persino in un luogo sbagliato o in pericolo, secondo una tabella di probabilità." },
  { nome: "Delayed Blast Fireball (Palla di Fuoco Ritardata)", livello: 7, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "45 metri (sfera raggio 6 m)", componenti: "V, S, M (una pallina di guano di pipistrello e zolfo)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Una scintilla color oro scaturisce dal tuo dito verso un punto entro gittata, dove poi rimane sospesa, pulsante di luce, finché non finisci di lanciare l'incantesimo o la tua concentrazione termina. Quando l'incantesimo finisce, la sfera esplode con un rombo basso in una sfera di fuoco di 6 metri di raggio: ogni creatura nell'area tenta un tiro salvezza su Destrezza, subendo 12d6 danni da fuoco se fallisce (metà se ha successo). Il danno aumenta di 1d6 per ogni round in cui hai mantenuto la concentrazione prima della detonazione, fino a un massimo di 10 round. Slot superiori: il danno base aumenta di 1d6 per ogni livello oltre il settimo." },
  { nome: "Fire Storm (Tempesta di Fuoco)", livello: 7, classi: ["chierico","druido"],
    tempo: "1 azione", gittata: "45 metri", componenti: "V, S", durata: "Istantanea",
    effetto: "Fiamme fiammeggianti appaiono e ardono in un'area formata da un massimo di dieci cubi di 3 metri di lato, che devi disporre in modo contiguo entro gittata. Ogni creatura in quell'area tenta un tiro salvezza su Destrezza, subendo 7d10 danni da fuoco se fallisce (metà se ha successo). Il fuoco incendia materiali infiammabili non indossati né trasportati e, se scegli, consuma vegetazione ordinaria nell'area senza danneggiare altre cose che desideri risparmiare." },
  { nome: "Divine Word (Parola Divina)", livello: 7, classi: ["chierico"],
    tempo: "1 azione bonus", gittata: "9 metri", componenti: "V", durata: "Istantanea",
    effetto: "Pronunci una parola infusa di potere divino, capace di far tremare le anime dei tuoi nemici. Scegli qualunque numero di creature ostili nemiche che riescono a sentirti entro gittata: ogni bersaglio che è di natura non celestiale, elementale, folletto o demoniaca subisce un effetto in base ai suoi punti ferita attuali (accecato, assordato e spaventato per 1 minuto se ha 50 pf o meno, con effetti crescenti fino alla morte istantanea se ha 20 pf o meno). Le creature immuni a essere spaventate sono comunque soggette agli altri effetti." },
  { nome: "Resurrection (Resurrezione)", livello: 7, classi: ["chierico","bardo"],
    tempo: "1 ora", gittata: "Tocco", componenti: "V, S, M (diamanti dal valore di almeno 1.000 mo, consumati)", durata: "Istantanea",
    effetto: "Tocchi una creatura morta da non più di un secolo che non è morta di vecchiaia: quella creatura torna in vita con tutti i suoi punti ferita. Questo incantesimo chiude anche eventuali ferite mortali e ripristina parti del corpo mancanti. La creatura riportata in vita deve tentare un tiro salvezza su Costituzione (CD 10, +1 per ogni decennio trascorso dalla morte) o subire un livello di spossatezza permanente." },
  { nome: "Reverse Gravity (Invertire Gravità)", livello: 7, classi: ["mago","stregone","druido"],
    tempo: "1 azione", gittata: "30 metri (cilindro raggio 15 m)", componenti: "V, S, M (una piuma d'uccello e del mercurio vivo)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Questo incantesimo inverte la gravità in un cilindro di 15 metri di raggio e 30 di altezza centrato su un punto entro gittata, per la durata. Ogni creatura e oggetto non ancorato nell'area cade verso l'alto, raggiungendo la sommità dell'area o volando via nello spazio se non c'è un tetto a fermarlo. Se una barriera solida blocca il percorso ascendente, l'oggetto o la creatura subisce lo stesso danno da caduta di una caduta normale, colpendo la barriera." },
  { nome: "Prismatic Spray (Spruzzo Prismatico)", livello: 7, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "Te stesso (cono di 18 m)", componenti: "V, S", durata: "Istantanea",
    effetto: "Otto raggi di luce colorata scoccano dalla tua mano in un cono di 18 metri. Ogni creatura nell'area viene colpita da uno o più raggi determinati a caso, ognuno con un effetto diverso (danno da un tipo elementale, paralisi, pietrificazione, morte istantanea, o trasporto in un altro piano), risolto tramite un tiro salvezza appropriato a ciascun colore." },
  { nome: "Regenerate (Rigenerare)", livello: 7, classi: ["chierico","druido","bardo"],
    tempo: "1 minuto", gittata: "Tocco", componenti: "V, S, M (un trifoglio fresco)", durata: "1 ora",
    effetto: "Tocchi una creatura e ne inneschi la capacità di rigenerarsi. Il bersaglio recupera 4d8+15 punti ferita immediatamente. Per la durata, il bersaglio recupera inoltre 1 punto ferita all'inizio di ogni suo turno. Se il bersaglio ha perso parti del corpo, queste ricrescono dopo 2 minuti se il bersaglio ha almeno 1 punto ferita per l'intera durata." },

  // INCANTESIMI DI 8° LIVELLO
  { nome: "Dominate Monster (Dominare Mostro)", livello: 8, classi: ["mago","stregone","bardo","warlock"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V, S", durata: "Concentrazione, fino a 1 ora",
    effetto: "Tenti di affascinare una creatura che vedi entro gittata, prendendone il controllo mentale come con Dominare Persona ma senza limiti di tipo di creatura. Il bersaglio tenta un tiro salvezza su Saggezza (con vantaggio se tu o i tuoi compagni siete in combattimento con lui): se fallisce, è dominato da te per la durata. Slot superiori: la durata diventa concentrazione fino a 8 ore con uno slot di 9° livello." },
  { nome: "Power Word Stun (Parola di Potere: Stordire)", livello: 8, classi: ["mago","stregone","warlock","bardo"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V", durata: "Istantanea",
    effetto: "Pronunci una parola di potere che può stordire una creatura che vedi entro gittata. Se il bersaglio ha 150 punti ferita o meno, resta stordito; altrimenti l'incantesimo non ha effetto. Il bersaglio stordito tenta un tiro salvezza su Costituzione alla fine di ciascuno dei suoi turni: se ha successo, la condizione termina." },
  { nome: "Sunburst (Raggio Solare)", livello: 8, classi: ["mago","druido"],
    tempo: "1 azione", gittata: "45 metri (sfera raggio 18 m)", componenti: "V, S, M (fuoco e una lente di ambra, cristallo o vetro)", durata: "Istantanea",
    effetto: "Luce brillante irrompe da un punto scelto entro gittata in una sfera di 18 metri di raggio. Ogni creatura nella sfera tenta un tiro salvezza su Costituzione, subendo 12d6 danni radiosi e restando accecata per 1 minuto se fallisce (metà danno e nessun accecamento se ha successo); i non morti e i costrutti animati da vita vegetale hanno svantaggio a questo tiro salvezza. Una creatura accecata può ripetere il tiro salvezza alla fine di ciascuno dei suoi turni. L'incantesimo disperde inoltre ogni oscurità magica nell'area." },
  { nome: "Earthquake (Terremoto)", livello: 8, classi: ["chierico","druido"],
    tempo: "1 azione", gittata: "150 metri (cerchio raggio 30 m)", componenti: "V, S, M (un pizzico di terra, un pezzo di roccia e un cristallo argilloso)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Crei un tremore del terreno in un cerchio di 30 metri di raggio centrato su un punto che tocchi il suolo entro gittata, per la durata. Ogni creatura sul terreno nell'area deve mantenere l'equilibrio con una prova di Destrezza ogni round o cadere prona; l'area può anche aprire crepacci, far crollare strutture non rinforzate presenti, e generare altri effetti devastanti a discrezione del Master." },
  { nome: "Holy Aura (Aura Sacra)", livello: 8, classi: ["chierico"],
    tempo: "1 azione", gittata: "Te stesso (raggio 9 m)", componenti: "V, S, M (un reliquiario dal valore di almeno 1.000 mo)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Luce divina irradia da te in un raggio di 9 metri. Scegli qualunque numero di creature volontarie in quell'area: per la durata, ciascuna emana luce fioca in un raggio di 1,5 metri, ha vantaggio ai tiri salvezza, e le creature ostili hanno svantaggio ai tiri per colpire contro di esse. Inoltre, quando una creatura folletto o non morto colpisce un bersaglio con un attacco in mischia, l'attaccante viene accecato fino alla fine del suo prossimo turno." },
  { nome: "Maze (Labirinto)", livello: 8, classi: ["mago","warlock"],
    tempo: "1 azione", gittata: "27 metri", componenti: "V, S", durata: "Concentrazione, fino a 10 minuti",
    effetto: "Bandisci una creatura che vedi entro gittata in un labirinto demiplanare. Il bersaglio resta lì per la durata o finché non ne trova l'uscita, cosa che richiede una prova di Intelligenza (CD 20); in caso di successo, il bersaglio ritorna nello spazio libero più vicino a dove si trovava. Puoi mantenere la concentrazione ogni round per costringere il bersaglio a rimanere." },
  { nome: "Antimagic Field (Campo Antimagico)", livello: 8, classi: ["mago"],
    tempo: "1 azione", gittata: "Te stesso (sfera raggio 3 m)", componenti: "V, S, M (un pizzico di polvere di ferro o limatura)", durata: "Concentrazione, fino a 1 ora",
    effetto: "Una sfera invisibile di antimagia di 3 metri di raggio ti circonda e si muove con te per la durata. L'area è impermeabile a gran parte della magia, incluse invocazioni e la maggior parte degli effetti magici, che non possono funzionare al suo interno né influenzare bersagli al suo interno; creature ed oggetti evocati o creati magicamente svaniscono momentaneamente se entrano nell'area." },
  { nome: "Feeblemind (Mente Debole)", livello: 8, classi: ["druido","bardo","warlock","mago"],
    tempo: "1 azione", gittata: "45 metri", componenti: "V, S, M (un topo, un pesce rosso o un altro piccolo animale vivo)", durata: "Istantanea",
    effetto: "Tenti di frantumare la mente di una creatura, imponendole una scarica di energia psichica devastante. Il bersaglio tenta un tiro salvezza su Intelligenza, subendo 4d6 danni psichici e vedendo i punteggi di Intelligenza e Carisma ridotti a 1 per la durata se fallisce (metà danno senza altro effetto se ha successo). Il bersaglio ridotto in questo modo non può lanciare incantesimi, attivare oggetti magici, comprendere il linguaggio o comunicare in modo intellegibile, finché l'effetto non viene rimosso con un Ripristino Superiore o un incantesimo simile." },

  // INCANTESIMI DI 9° LIVELLO
  { nome: "Wish (Desiderio)", livello: 9, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "Te stesso", componenti: "V", durata: "Istantanea",
    effetto: "L'incantesimo più potente che un mortale possa lanciare: puoi enunciare un desiderio che, entro certi limiti, la realtà tenta di soddisfare. Puoi duplicare l'effetto di qualunque incantesimo di 8° livello o inferiore senza rispettarne i requisiti, oppure creare uno dei diversi effetti maggiori (curare completamente più creature, ripristinare vita senza penalità, potenziare temporaneamente un'arma o degli oggetti, e altro). Usare l'incantesimo per qualunque effetto diverso dal semplice duplicare un altro incantesimo comporta un forte stress fisico: rischi di non poter più lanciare Desiderio in futuro, e ogni utilizzo di questo tipo ti infligge spossatezza." },
  { nome: "Meteor Swarm (Pioggia di Meteore)", livello: 9, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "1,5 km", componenti: "V, S", durata: "Istantanea",
    effetto: "Sfere fiammeggianti scagliano dal cielo in quattro punti a tua scelta entro gittata, ciascuno il centro di una sfera di 12 metri di raggio. Ogni creatura in una o più di queste aree tenta un tiro salvezza su Destrezza, subendo 20d6 danni da fuoco e 20d6 danni contundenti se fallisce (metà se ha successo); una creatura in più aree subisce l'effetto una volta sola per ogni area in cui si trova. L'incantesimo incendia inoltre materiali infiammabili non indossati né trasportati nelle aree e può distruggere strutture non rinforzate." },
  { nome: "Power Word Kill (Parola di Potere: Uccidere)", livello: 9, classi: ["mago","stregone","warlock","bardo"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V", durata: "Istantanea",
    effetto: "Pronunci una parola di potere capace di stroncare la vita di una creatura che vedi entro gittata. Se il bersaglio ha 100 punti ferita o meno, muore istantaneamente; altrimenti l'incantesimo non ha effetto." },
  { nome: "True Resurrection (Vera Resurrezione)", livello: 9, classi: ["chierico","druido"],
    tempo: "1 ora", gittata: "Tocco", componenti: "V, S, M (diamanti dal valore di almeno 25.000 mo, consumati)", durata: "Istantanea",
    effetto: "Tocchi una creatura morta da non più di 200 anni che non è morta di vecchiaia, oppure pronunci il nome della creatura se possiedi solo un frammento del suo corpo: quella creatura torna in vita con tutti i suoi punti ferita. Questo incantesimo chiude ferite mortali, ripristina parti del corpo mancanti, rimuove ogni veleno e malattia, e può persino creare un corpo del tutto nuovo se quello originale è distrutto." },
  { nome: "Foresight (Preveggenza)", livello: 9, classi: ["bardo","druido","warlock","mago"],
    tempo: "1 minuto", gittata: "Tocco", componenti: "V, S, M (un piede di talpa e un occhio d'aquila o falco, entrambi conservati sott'alcol)", durata: "8 ore",
    effetto: "Tocchi una creatura volontaria e le doni un vago sentore del futuro immediato. Per la durata, il bersaglio non può essere colto di sorpresa e ha vantaggio ai tiri per colpire, alle prove di abilità e ai tiri salvezza, mentre ogni creatura che lo attacca ha svantaggio al tiro per colpire." },
  { nome: "Mass Heal (Guarigione di Massa)", livello: 9, classi: ["chierico"],
    tempo: "1 azione", gittata: "36 metri", componenti: "V, S", durata: "Istantanea",
    effetto: "Un'onda di energia curativa scorre dal luogo che scegli entro gittata: puoi distribuire 700 punti ferita di cura tra qualunque numero di creature che vedi in quell'area, curando anche cecità e sordità in ciascuna di esse. Questo incantesimo non ha effetto sui non morti né sui costrutti." },
  { nome: "Storm of Vengeance (Tempesta di Vendetta)", livello: 9, classi: ["druido"],
    tempo: "1 azione", gittata: "1,5 km (raggio 360 m)", componenti: "V, S", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Una nube temporalesca appare, centrata su un punto che scegli entro gittata e si estende per 360 metri di raggio. Ogni turno per la durata, la tempesta genera un effetto differente e crescente (tuono assordante, acido corrosivo, fulmini scagliati, grandine violenta, venti fortissimi e infine una pioggia torrenziale che rallenta ogni creatura nell'area), infliggendo vari tipi di danno alle creature nemiche sotto la tempesta." },
  { nome: "Time Stop (Fermare il Tempo)", livello: 9, classi: ["mago","stregone"],
    tempo: "1 azione", gittata: "Te stesso", componenti: "V", durata: "Istantanea",
    effetto: "Fermi il flusso del tempo per te, ottenendo 1d4+1 turni aggiuntivi consecutivi in cui agisci, durante i quali le altre creature restano congelate nel tempo. L'incantesimo termina anticipatamente se una delle tue azioni in questo periodo, o un effetto che crei, influenza una creatura diversa da te o un oggetto indossato o trasportato da qualcuno diverso da te." },
  { nome: "Gate (Portale)", livello: 9, classi: ["chierico","mago"],
    tempo: "1 azione", gittata: "18 metri", componenti: "V, S, M (un diamante dal valore di almeno 5.000 mo)", durata: "Concentrazione, fino a 1 minuto",
    effetto: "Crei un portale che collega un punto vuoto che riesci a vedere entro gittata a un luogo preciso su un altro piano di esistenza. Il portale è una sfera piatta e circolare orientata a tuo piacere, che permette il passaggio in entrambe le direzioni tra il tuo piano e quello di destinazione. Se conosci il nome specifico di una creatura originaria di quell'altro piano, puoi pronunciarlo mentre lanci l'incantesimo per attirare quella creatura vicino al portale dalla sua parte, sebbene non sia obbligata ad attraversarlo." },
];

// Parametri di lancio incantesimi al 1° livello per ciascuna classe
const SPELLCASTING_META = {
  bardo: { cantrips: 2, level1: 4, slots1: 2, tipo: "known" },
  chierico: { cantrips: 3, level1: 4, slots1: 2, tipo: "prepared" },
  druido: { cantrips: 2, level1: 4, slots1: 2, tipo: "prepared" },
  mago: { cantrips: 3, level1: 6, slots1: 2, tipo: "spellbook" },
  stregone: { cantrips: 4, level1: 2, slots1: 2, tipo: "known" },
  warlock: { cantrips: 2, level1: 2, slots1: 1, tipo: "pact" },
  paladino: { cantrips: 0, level1: 2, slots1: 2, tipo: "prepared" },
  ranger: { cantrips: 0, level1: 2, slots1: 2, tipo: "prepared" },
};

const TIPO_INCANTATORE_TESTO = {
  known: "Conosci un numero fisso di incantesimi: quelli che scegli ora restano gli stessi finché non sali di livello.",
  prepared: "Ogni giorno, dopo un riposo lungo, puoi scegliere di nuovo quali incantesimi preparare da tutta la lista della tua classe: quelli scelti qui sono un buon punto di partenza.",
  spellbook: "Il tuo Grimorio può contenere più incantesimi di quanti tu possa preparare in un giorno: quelli scelti qui sono ciò che il tuo Grimorio contiene all'inizio.",
  pact: "La tua magia funziona diversamente: pochi slot, ma tornano disponibili anche dopo un semplice riposo breve, non solo dopo uno lungo.",
};
const COSTO_PUNTI = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

/* ============================= PROGRESSIONE PER LIVELLO (1-20) ============================= */

// Slot incantesimo per un incantatore completo, per livello del personaggio (1° via 9° livello di incantesimo)
const FULL_CASTER_SLOTS = {
  1:[2,0,0,0,0,0,0,0,0], 2:[3,0,0,0,0,0,0,0,0], 3:[4,2,0,0,0,0,0,0,0], 4:[4,3,0,0,0,0,0,0,0],
  5:[4,3,2,0,0,0,0,0,0], 6:[4,3,3,0,0,0,0,0,0], 7:[4,3,3,1,0,0,0,0,0], 8:[4,3,3,2,0,0,0,0,0],
  9:[4,3,3,3,1,0,0,0,0], 10:[4,3,3,3,2,0,0,0,0], 11:[4,3,3,3,2,1,0,0,0], 12:[4,3,3,3,2,1,0,0,0],
  13:[4,3,3,3,2,1,1,0,0], 14:[4,3,3,3,2,1,1,0,0], 15:[4,3,3,3,2,1,1,1,0], 16:[4,3,3,3,2,1,1,1,0],
  17:[4,3,3,3,2,1,1,1,1], 18:[4,3,3,3,3,1,1,1,1], 19:[4,3,3,3,3,2,1,1,1], 20:[4,3,3,3,3,2,2,1,1],
};

// Magia del Patto (Warlock): numero di slot e loro livello, per livello del personaggio
const PACT_SLOTS = {
  1:{count:1,livelloSlot:1}, 2:{count:2,livelloSlot:1}, 3:{count:2,livelloSlot:2}, 4:{count:2,livelloSlot:2},
  5:{count:2,livelloSlot:3}, 6:{count:2,livelloSlot:3}, 7:{count:2,livelloSlot:4}, 8:{count:2,livelloSlot:4},
  9:{count:2,livelloSlot:5}, 10:{count:2,livelloSlot:5}, 11:{count:3,livelloSlot:5}, 12:{count:3,livelloSlot:5},
  13:{count:3,livelloSlot:5}, 14:{count:3,livelloSlot:5}, 15:{count:3,livelloSlot:5}, 16:{count:3,livelloSlot:5},
  17:{count:4,livelloSlot:5}, 18:{count:4,livelloSlot:5}, 19:{count:4,livelloSlot:5}, 20:{count:4,livelloSlot:5},
};

// Livelli a cui la maggior parte delle classi ottiene un Aumento di Caratteristica (o Talento)
const LIVELLI_ASI = {
  guerriero: [4,6,8,12,14,16,19],
  ladro: [4,8,10,12,16,19],
  default: [4,8,12,16,19],
};

function calcolaSlotIncantesimo(classe, livello, spellMeta) {
  if (!classe || !spellMeta) return null;
  if (spellMeta.tipo === "pact") {
    const p = PACT_SLOTS[Math.min(Math.max(livello,1),20)];
    return { tipo: "pact", righe: [{ livello: p.livelloSlot, quantita: p.count }] };
  }
  const isHalf = classe.id === "paladino" || classe.id === "ranger";
  const rigaLivello = isHalf ? Math.min(livello + 1, 20) : Math.min(Math.max(livello,1), 20);
  const riga = FULL_CASTER_SLOTS[rigaLivello];
  const maxSlotLivello = isHalf ? 5 : 9;
  const righe = [];
  for (let i = 0; i < maxSlotLivello; i++) { if (riga[i] > 0) righe.push({ livello: i + 1, quantita: riga[i] }); }
  return { tipo: spellMeta.tipo, righe };
}

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
  { label: "Incant.", rune: "ᚢ" },
  { label: "Storia", rune: "ᛃ" },
  { label: "Scheda", rune: "ᛖ" },
];

/* ============================= FUNZIONI DI SUPPORTO ============================= */

function mod(score) { return Math.floor((score - 10) / 2); }
function metri(ft) { const m = ft * 0.3; return Number.isInteger(m) ? m : m.toFixed(1); }
function fmt(n) { return (n >= 0 ? "+" : "") + n; }
function byId(list, id) { return list.find((x) => x.id === id) || null; }

function SpellBlock({ nome }) {
  const s = SPELLS.find((x) => x.nome === nome);
  if (!s) return null;
  return (
    <div className="tratto spell-block">
      <b>{s.nome}</b> <span style={{fontSize:11, color:"var(--ink-dim)"}}>({s.livello === 0 ? "Trucchetto" : `${s.livello}° livello`})</span>
      <div className="spell-meta">
        <span><b>Tempo:</b> {s.tempo}</span>
        <span><b>Gittata:</b> {s.gittata}</span>
        <span><b>Componenti:</b> {s.componenti}</span>
        <span><b>Durata:</b> {s.durata}</span>
      </div>
      <p>{s.effetto}</p>
    </div>
  );
}

/* ============================= APP ============================= */

export default function App() {
  const [step, setStep] = useState(0);
  const [nome, setNome] = useState("");
  const [livello, setLivello] = useState(1);
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

  const [trucchettiScelti, setTrucchettiScelti] = useState([]);
  const [incantesimiScelti, setIncantesimiScelti] = useState([]);

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
    try { localStorage.removeItem("ultimoPersonaggioId"); } catch (e) {}
    setPersonaggioId(null); setSalvataggioStato(null);
    setNome(""); setLivello(1); setSpecieId(null); setSottospecieId(null); setClasseId(null); setBackgroundId(null);
    setMetodo("standard"); setAssegnazione({ for: null, des: null, cos: null, int: null, sag: null, car: null });
    setPointBuy({ for: 8, des: 8, cos: 8, int: 8, sag: 8, car: 8 });
    setBgModo("duePiuUno"); setBgPiuDue(null); setBgPiuUno(null);
    setSkillScelte([]); setArmaMischia(null); setArmaDistanza(null); setArmaturaScelta(null);
    setScudoScelto(false); setPreferisceOro(false);
    setTrucchettiScelti([]); setIncantesimiScelti([]);
    setAspetto(""); setTratti(""); setIdeali(""); setLegami(""); setDifetti(""); setBackstory("");
    setVista("wizard"); setStep(0);
  }

  function salvaPersonaggio() {
    setSalvataggioStato("salvando");
    const id = personaggioId || `p_${Date.now()}`;
    const dato = {
      id, savedAt: Date.now(), step, nome, livello, specieId, sottospecieId, classeId, backgroundId,
      metodo, assegnazione, pointBuy, bgModo, bgPiuDue, bgPiuUno, skillScelte,
      armaMischia, armaDistanza, armaturaScelta, scudoScelto, preferisceOro,
      trucchettiScelti, incantesimiScelti,
      aspetto, tratti, ideali, legami, difetti, backstory,
    };
    try {
      localStorage.setItem(`personaggi:${id}`, JSON.stringify(dato));
      localStorage.setItem("ultimoPersonaggioId", id);
      setPersonaggioId(id);
      setSalvataggioStato("salvato");
    } catch (e) {
      setSalvataggioStato("errore");
    }
  }

  function caricaPersonaggio(dato, vaiAllaScheda = true) {
    setPersonaggioId(dato.id || null);
    setNome(dato.nome || "");
    setLivello(dato.livello || 1);
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
    setTrucchettiScelti(dato.trucchettiScelti || []);
    setIncantesimiScelti(dato.incantesimiScelti || []);
    setAspetto(dato.aspetto || "");
    setTratti(dato.tratti || "");
    setIdeali(dato.ideali || "");
    setLegami(dato.legami || "");
    setDifetti(dato.difetti || "");
    setBackstory(dato.backstory || "");
    setVista("wizard");
    if (vaiAllaScheda) {
      setSalvataggioStato("salvato");
      setStep(9);
    } else {
      setStep(dato.step || 0);
    }
    if (dato.id) { try { localStorage.setItem("ultimoPersonaggioId", dato.id); } catch (e) {} }
  }

  // Ripristina automaticamente l'ultimo personaggio su cui si stava lavorando,
  // così un aggiornamento della pagina o una chiusura accidentale non fa perdere nulla.
  useEffect(() => {
    try {
      const lastId = localStorage.getItem("ultimoPersonaggioId");
      if (lastId) {
        const raw = localStorage.getItem(`personaggi:${lastId}`);
        if (raw) caricaPersonaggio(JSON.parse(raw), false);
      }
    } catch (e) { /* nessun salvataggio precedente valido, si parte da zero */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosalvataggio: appena qualcosa cambia, salva in automatico dopo una breve pausa.
  useEffect(() => {
    if (vista !== "wizard") return;
    if (!nome && !specieId && !classeId && !backgroundId) return;
    setSalvataggioStato(null);
    const t = setTimeout(() => { salvaPersonaggio(); }, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nome, livello, specieId, sottospecieId, classeId, backgroundId, metodo, assegnazione, pointBuy, bgModo, bgPiuDue, bgPiuUno, skillScelte, armaMischia, armaDistanza, armaturaScelta, scudoScelto, preferisceOro, trucchettiScelti, incantesimiScelti, aspetto, tratti, ideali, legami, difetti, backstory]);

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

  const profBonus = 2 + Math.floor((livello - 1) / 4);
  const avgHitDie = classe ? Math.floor(classe.dado / 2) + 1 : 0;
  const hp = classe
    ? Math.max(livello, classe.dado + mod(punteggiFinali.cos) + (livello - 1) * (avgHitDie + mod(punteggiFinali.cos)))
    : null;
  const livelliAsi = classe ? (LIVELLI_ASI[classe.id] || LIVELLI_ASI.default) : [];
  const asiOttenuti = livelliAsi.filter((l) => l <= livello).length;

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

  const spellMeta = classe ? SPELLCASTING_META[classe.id] || null : null;
  const slotIncantesimo = calcolaSlotIncantesimo(classe, livello, spellMeta);
  const livelloMassimoIncantesimo = slotIncantesimo && slotIncantesimo.righe.length ? Math.max(...slotIncantesimo.righe.map((r) => r.livello)) : 0;

  const trucchettiDisponibili = useMemo(() => {
    if (!classe) return [];
    return SPELLS.filter((s) => s.livello === 0 && s.classi.includes(classe.id));
  }, [classe]);
  const incantesimiDisponibili = useMemo(() => {
    if (!classe) return [];
    return SPELLS.filter((s) => s.livello >= 1 && s.livello <= livelloMassimoIncantesimo && s.classi.includes(classe.id));
  }, [classe, livelloMassimoIncantesimo]);

  const cantripsAttuali = spellMeta ? spellMeta.cantrips + (livello >= 4 ? 1 : 0) + (livello >= 10 ? 1 : 0) : 0;
  // Numero totale di incantesimi (di qualunque livello tra quelli sbloccati) che il personaggio conosce o può preparare
  const incantesimiPickAttuale = spellMeta ? Math.min(spellMeta.level1 + (livello - 1) * 2, incantesimiDisponibili.length) : 0;

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
        .spell-block { border-left: 2px solid var(--gold); padding-left: 10px; margin-bottom: 14px; }
        .spell-meta { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 12px; color: var(--ink-dim); margin-top: 3px; }
        .spell-meta b { color: var(--gold); font-family: 'Cinzel', serif; font-weight: 500; }

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
                <div className="tratto"><b>7. Incantesimi</b><p>Solo per le classi che li usano: trucchetti e incantesimi conosciuti al 1° livello.</p></div>
                <div className="tratto"><b>8. Storia</b><p>Chi è davvero: aspetto, personalità e il racconto della sua vita prima dell'avventura.</p></div>
                <div className="tratto"><b>9. La Scheda</b><p>Il riepilogo completo, pronto per il tavolo di gioco.</p></div>
              </div>
              <div style={{ marginTop: 20, display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div>
                  <span style={{ fontSize: 13, color: "var(--ink-dim)" }}>Nome del personaggio (puoi cambiarlo in ogni momento)</span>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="es. Elenya Nottealta"
                    style={{ display: "block", marginTop: 6, width: "100%", maxWidth: 360, background: "var(--bg-panel)", border: "1px solid var(--line)", borderRadius: 4, padding: "10px 12px", color: "var(--ink)", fontFamily: "Cinzel, serif" }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: 13, color: "var(--ink-dim)" }}>Livello (puoi cambiarlo quando vuoi, anche a personaggio già creato, per "salirlo" di livello)</span>
                  <div className="pb-controls" style={{ justifyContent: "flex-start", marginTop: 6 }}>
                    <button disabled={livello <= 1} onClick={() => setLivello(Math.max(1, livello - 1))}>−</button>
                    <span style={{ fontFamily: "Cinzel, serif", fontSize: 22, minWidth: 30, textAlign: "center" }}>{livello}</span>
                    <button disabled={livello >= 20} onClick={() => setLivello(Math.min(20, livello + 1))}>+</button>
                  </div>
                </div>
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
                  <button key={c.id} className={`choice ${classeId === c.id ? "sel" : ""}`} onClick={() => { setClasseId(c.id); setSkillScelte([]); setArmaMischia(null); setArmaDistanza(null); setArmaturaScelta(null); setScudoScelto(false); setPreferisceOro(false); setTrucchettiScelti([]); setIncantesimiScelti([]); }}>
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

          {/* STEP 7 — INCANTESIMI */}
          {step === 7 && classe && spellMeta && (
            <div className="card">
              <div className="eyebrow">Passo 7</div>
              <h2 className="titolo">Incantesimi</h2>
              <p className="sottotitolo">{TIPO_INCANTATORE_TESTO[spellMeta.tipo]}</p>

              <div className="stat-row">
                {slotIncantesimo?.righe.map((r) => (
                  <div className="stat-pill" key={r.livello}><div className="n">{r.quantita}</div><div className="l">Slot {r.livello}° liv.</div></div>
                ))}
              </div>
              {slotIncantesimo?.tipo === "pact" && <div className="helper">Magia del Patto: questi slot tornano disponibili anche dopo un semplice riposo breve, non solo dopo uno lungo.</div>}

              {spellMeta.cantrips > 0 && (
                <>
                  <div className="eyebrow" style={{ marginTop: 16 }}>Trucchetti — scegline {cantripsAttuali} ({trucchettiScelti.length}/{cantripsAttuali})</div>
                  <div className="skill-list">
                    {trucchettiDisponibili.map((s) => {
                      const on = trucchettiScelti.includes(s.nome);
                      const bloccato = !on && trucchettiScelti.length >= cantripsAttuali;
                      return (
                        <div key={s.nome} className={`skill-item pickable ${on ? "on" : ""} ${bloccato ? "locked" : ""}`}
                          onClick={() => { if (bloccato) return; setTrucchettiScelti(on ? trucchettiScelti.filter(x => x !== s.nome) : [...trucchettiScelti, s.nome]); }}
                          title={s.effetto}>
                          {s.nome}
                        </div>
                      );
                    })}
                  </div>
                  {trucchettiScelti.length > 0 && (
                    <div className="detail" style={{ marginTop: 10, borderTop: "none", paddingTop: 0 }}>
                      {trucchettiScelti.map((n) => <SpellBlock nome={n} key={n} />)}
                    </div>
                  )}
                </>
              )}

              <div className="eyebrow" style={{ marginTop: 20 }}>
                Incantesimi{livelloMassimoIncantesimo > 1 ? ` (fino al ${livelloMassimoIncantesimo}° livello)` : " di 1° livello"} — scegline {incantesimiPickAttuale} ({incantesimiScelti.length}/{incantesimiPickAttuale})
              </div>
              {Array.from({ length: livelloMassimoIncantesimo }, (_, i) => i + 1).map((lv) => {
                const gruppo = incantesimiDisponibili.filter((s) => s.livello === lv);
                if (gruppo.length === 0) return null;
                return (
                  <div key={lv} style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 12.5, color: "var(--gold)", fontFamily: "Cinzel, serif", marginBottom: 6 }}>{lv}° livello</div>
                    <div className="skill-list">
                      {gruppo.map((s) => {
                        const on = incantesimiScelti.includes(s.nome);
                        const bloccato = !on && incantesimiScelti.length >= incantesimiPickAttuale;
                        return (
                          <div key={s.nome} className={`skill-item pickable ${on ? "on" : ""} ${bloccato ? "locked" : ""}`}
                            onClick={() => { if (bloccato) return; setIncantesimiScelti(on ? incantesimiScelti.filter(x => x !== s.nome) : [...incantesimiScelti, s.nome]); }}
                            title={s.effetto}>
                            {s.nome}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {incantesimiScelti.length > 0 && (
                <div className="detail" style={{ marginTop: 10, borderTop: "none", paddingTop: 0 }}>
                  {incantesimiScelti.map((n) => <SpellBlock nome={n} key={n} />)}
                </div>
              )}

              <div className="footer-nav">
                <button className="btn" onClick={() => vaiA(6)}>← Indietro</button>
                <button className="btn primary" onClick={() => vaiA(8)}>Avanti →</button>
              </div>
            </div>
          )}
          {step === 7 && classe && !spellMeta && (
            <div className="card">
              <div className="eyebrow">Passo 7</div>
              <h2 className="titolo">Nessun incantesimo per questa classe</h2>
              <p className="sottotitolo">Il {classe.nome} non lancia incantesimi al 1° livello: può proseguire direttamente alla storia del personaggio. (Alcune sottoclassi ne ottengono più avanti, a livelli successivi.)</p>
              <div className="footer-nav">
                <button className="btn" onClick={() => vaiA(6)}>← Indietro</button>
                <button className="btn primary" onClick={() => vaiA(8)}>Avanti →</button>
              </div>
            </div>
          )}
          {step === 7 && !classe && (
            <div className="card">
              <div className="eyebrow">Passo 7</div>
              <h2 className="titolo">Prima serve una classe</h2>
              <p className="sottotitolo">Solo alcune classi lanciano incantesimi, e la lista disponibile dipende da quale scegli.</p>
              <div className="detail" style={{marginTop:0, borderTop:"none", paddingTop:0}}>
                <span style={{color:"var(--gold-bright)", cursor:"pointer"}} onClick={() => vaiA(2)}>vai al passo 2 — Classe</span>
              </div>
            </div>
          )}

          {/* STEP 8 — STORIA DEL PERSONAGGIO */}
          {step === 8 && (
            <div className="card">
              <div className="eyebrow">Passo 8</div>
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
                <button className="btn" onClick={() => vaiA(7)}>← Indietro</button>
                <button className="btn primary" onClick={() => vaiA(9)}>Vai alla scheda →</button>
              </div>
            </div>
          )}

          {/* STEP 8 — SCHEDA RIEPILOGO */}
          {step === 9 && specie && classe && background && (
            <div className="card sheet">
              <div className="sheet-head">
                <div>
                  <input value={nome} onChange={(e)=>setNome(e.target.value)} placeholder="Nome del personaggio" />
                  <div className="sheet-sub">{specie.nome}{sottospecie ? ` (${sottospecie.nome})` : ""} · {classe.nome} · {background.nome} · Livello {livello}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="sheet-sub">Bonus di competenza {fmt(profBonus)}</div>
                  <div className="pb-controls" style={{ justifyContent: "flex-end", marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: "var(--ink-dim)", marginRight: 4 }}>Livello</span>
                    <button disabled={livello <= 1} onClick={() => setLivello(Math.max(1, livello - 1))}>−</button>
                    <span style={{ fontFamily: "Cinzel, serif", fontSize: 18, minWidth: 24, textAlign: "center" }}>{livello}</span>
                    <button disabled={livello >= 20} onClick={() => setLivello(Math.min(20, livello + 1))}>+</button>
                  </div>
                </div>
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

                  {livello > 1 && (
                    <>
                      <div className="eyebrow" style={{marginTop:16}}>Aumenti di Caratteristica / Talenti</div>
                      <p style={{fontSize:14.5, margin:0}}>
                        Al livello {livello} hai ottenuto {asiOttenuti} {asiOttenuti === 1 ? "Aumento di Caratteristica" : "Aumenti di Caratteristica"} (ai livelli: {livelliAsi.filter(l => l <= livello).join(", ") || "nessuno ancora"}).
                        Ognuno vale +2 a un punteggio o +1 a due punteggi, oppure un talento a scelta: applicalo direttamente ai tuoi punteggi al Passo 5 o annotalo qui sotto nella storia.
                      </p>
                    </>
                  )}

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

              {spellMeta && (
                <div className="detail">
                  <div className="eyebrow">Incantesimi{slotIncantesimo?.tipo === "pact" ? " — Magia del Patto" : ""}</div>
                  <div className="stat-row" style={{marginTop:6, marginBottom:10}}>
                    {slotIncantesimo?.righe.map((r) => (
                      <div className="stat-pill" key={r.livello}><div className="n">{r.quantita}</div><div className="l">Slot {r.livello}° liv.</div></div>
                    ))}
                  </div>
                  {trucchettiScelti.length > 0 && (
                    <>
                      <div style={{fontSize:13, color:"var(--gold)", marginTop:6, marginBottom:2}}>Trucchetti</div>
                      {trucchettiScelti.map((n) => <SpellBlock nome={n} key={n} />)}
                    </>
                  )}
                  {incantesimiScelti.length > 0 && (
                    <>
                      <div style={{fontSize:13, color:"var(--gold)", marginTop:10, marginBottom:2}}>Incantesimi di 1° livello</div>
                      {incantesimiScelti.map((n) => <SpellBlock nome={n} key={n} />)}
                    </>
                  )}
                  {trucchettiScelti.length === 0 && incantesimiScelti.length === 0 && (
                    <p style={{fontSize:14.5, margin:0, color:"var(--ink-dim)"}}>Nessun incantesimo scelto ancora — torna al Passo 7 per sceglierli.</p>
                  )}
                </div>
              )}

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
                <button className="btn" onClick={() => vaiA(8)}>← Indietro</button>
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
          {step === 9 && !(specie && classe && background) && (
            <div className="card">
              <div className="eyebrow">Passo 9</div>
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
