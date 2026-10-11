"use client";

import { useEffect, useId, useRef, useState } from "react";

export type CognitiveGuideLanguage = "fr" | "ar" | "en";

export interface InteractiveCognitiveGuideProps {
  language?: CognitiveGuideLanguage;
  className?: string;
}

type Step = 0 | 1 | 2;

const darijaTranscript = "شنو كاين داخل الخلية؟ النواة كتعاون الخلية تنظّم الخدمة ديالها.";

const copy = {
  fr: {
    kicker: "GUIDE INTERACTIF · SVT COLLÈGE",
    title: "Du premier déclic au souvenir durable",
    intro: "Trois gestes pédagogiques pour organiser une séance de 55 minutes, sans prétendre mesurer le cerveau des élèves.",
    choose: "Choisir une étape du parcours",
    demonstration: "Démonstration pédagogique",
    lesson: "Exemple · La cellule vivante",
    steps: [
      { label: "Capter l’attention", tag: "FOCALISATION", time: "0–15 min", description: "Une situation-problème courte engage l’observation avant les explications." },
      { label: "Associer image et parole", tag: "DOUBLE CODAGE", time: "15–35 min", description: "Un schéma animé et une explication orale se complètent sans se répéter." },
      { label: "Réactiver la notion", tag: "CONSOLIDATION", time: "Après la séance", description: "Deux rappels brefs, à J+2 et J+7, aident à retrouver l’idée essentielle." },
    ],
    focusTitle: "Une question, puis une observation",
    focusQuestion: "Pourquoi une feuille a-t-elle besoin de cellules pour fonctionner ?",
    focusObserve: "Observer une coupe de feuille",
    focusHypothesis: "Formuler une hypothèse",
    focusPrinciple: "Mémoire de travail : un seul problème clair, des indices utiles et du temps pour chercher.",
    leaf: "Feuille", cells: "Cellules", problem: "SITUATION-PROBLÈME", autonomous: "Recherche autonome",
    dualTitle: "Voir et entendre, à son rythme",
    dualPrinciple: "Le double codage de Paivio associe une représentation visuelle à une explication verbale. Les deux supports restent facultatifs et contrôlables.",
    visual: "Capsule visuelle 3D", nucleus: "Noyau", membrane: "Membrane", playVisual: "Animer le modèle", pauseVisual: "Mettre le modèle en pause",
    audio: "Audio en darija", playAudio: "Écouter l’explication", stopAudio: "Arrêter l’audio", transcript: "Transcription", audioMeaning: "La question porte sur l’intérieur de la cellule et le rôle organisateur du noyau.",
    audioUnavailable: "La synthèse vocale n’est pas disponible dans ce navigateur. La transcription reste lisible.",
    audioError: "La lecture vocale a échoué. Utilisez la transcription ci-dessous.",
    mediaNote: "Modèle vectoriel animé et lecture vocale du navigateur ; aucun média externe n’est chargé.",
    recallTitle: "Deux rappels courts prolongent l’apprentissage",
    recallPrinciple: "Une question à J+2, puis un retour ciblé à J+7 : l’élève récupère activement la notion au lieu de simplement la relire.",
    without: "Sans rappel", with: "Avec rappels", retention: "Rétention illustrative", day2: "Question de rappel", day7: "Application rapide", curveNote: "Schéma indicatif inspiré de la courbe de l’oubli ; il ne prédit pas la mémoire d’un élève.",
  },
  ar: {
    kicker: "دليل تفاعلي · علوم الحياة والأرض",
    title: "من لحظة الانتباه إلى تذكر يدوم",
    intro: "ثلاث خطوات بيداغوجية لتنظيم حصة من 55 دقيقة، دون الادعاء بقياس دماغ المتعلم.",
    choose: "اختر مرحلة من المسار",
    demonstration: "عرض بيداغوجي",
    lesson: "مثال · الخلية الحية",
    steps: [
      { label: "جذب الانتباه", tag: "التركيز", time: "0–15 دقيقة", description: "وضعية مشكلة قصيرة تدعو إلى الملاحظة قبل تقديم التفسير." },
      { label: "ربط الصورة بالكلام", tag: "الترميز المزدوج", time: "15–35 دقيقة", description: "رسم متحرك وشرح شفهي يكمل أحدهما الآخر دون تكرار زائد." },
      { label: "استرجاع الفكرة", tag: "ترسيخ التعلم", time: "بعد الحصة", description: "استرجاعان موجزان بعد يومين وسبعة أيام يساعدان على تذكر الفكرة الأساسية." },
    ],
    focusTitle: "سؤال واحد، ثم ملاحظة",
    focusQuestion: "لماذا تحتاج الورقة إلى خلايا كي تقوم بوظيفتها؟",
    focusObserve: "ملاحظة مقطع من ورقة", focusHypothesis: "صياغة فرضية",
    focusPrinciple: "الذاكرة العاملة: مشكلة واضحة واحدة، ومعطيات مفيدة، ووقت للبحث.",
    leaf: "ورقة", cells: "خلايا", problem: "وضعية مشكلة", autonomous: "بحث ذاتي",
    dualTitle: "الصورة والصوت وفق إيقاع المتعلم",
    dualPrinciple: "يجمع الترميز المزدوج عند بايفيو بين تمثيل بصري وشرح لفظي. ويمكن التحكم في كل وسيلة على حدة.",
    visual: "عرض بصري ثلاثي الأبعاد", nucleus: "النواة", membrane: "الغشاء", playVisual: "تشغيل الرسم", pauseVisual: "إيقاف حركة الرسم",
    audio: "شرح بالدارجة", playAudio: "استمع إلى الشرح", stopAudio: "أوقف الصوت", transcript: "النص المسموع", audioMeaning: "يتناول السؤال ما يوجد داخل الخلية ودور النواة في تنظيم عملها.",
    audioUnavailable: "النطق الآلي غير متاح في هذا المتصفح. يمكنك قراءة النص أدناه.",
    audioError: "تعذر تشغيل النطق الآلي. اقرأ النص أدناه.",
    mediaNote: "رسم متحرك ونطق آلي من المتصفح؛ لا تُحمّل وسائط خارجية.",
    recallTitle: "استرجاعان قصيران يساعدان على تثبيت التعلم",
    recallPrinciple: "سؤال بعد يومين ثم تطبيق موجز بعد سبعة أيام: يسترجع المتعلم الفكرة بنشاط بدل إعادة قراءتها فقط.",
    without: "دون استرجاع", with: "مع الاسترجاع", retention: "تذكر توضيحي", day2: "سؤال استرجاع", day7: "تطبيق سريع", curveNote: "رسم توضيحي مستوحى من منحنى النسيان؛ لا يتنبأ بذاكرة أي متعلم.",
  },
  en: {
    kicker: "INTERACTIVE GUIDE · MIDDLE SCHOOL SCIENCE",
    title: "From first attention to lasting recall",
    intro: "Three teaching moves for a 55-minute lesson, without claiming to measure a learner’s brain.",
    choose: "Choose a step in the pathway",
    demonstration: "Teaching demonstration",
    lesson: "Example · The living cell",
    steps: [
      { label: "Capture attention", tag: "FOCUS", time: "0–15 min", description: "A short problem invites observation before an explanation is given." },
      { label: "Pair image and speech", tag: "DUAL CODING", time: "15–35 min", description: "An animated diagram and spoken explanation support each other without extra clutter." },
      { label: "Recall the idea", tag: "CONSOLIDATION", time: "After class", description: "Brief recalls on day 2 and day 7 help retrieve the key idea." },
    ],
    focusTitle: "One question, then observation",
    focusQuestion: "Why does a leaf need cells to do its work?",
    focusObserve: "Observe a leaf section", focusHypothesis: "Write a hypothesis",
    focusPrinciple: "Working memory: one clear problem, relevant clues, and time to investigate.",
    leaf: "Leaf", cells: "Cells", problem: "PROBLEM SITUATION", autonomous: "Independent inquiry",
    dualTitle: "See and hear at your own pace",
    dualPrinciple: "Paivio’s dual coding pairs a visual representation with spoken explanation. Learners can control either medium.",
    visual: "3D visual capsule", nucleus: "Nucleus", membrane: "Membrane", playVisual: "Animate model", pauseVisual: "Pause model",
    audio: "Darija audio", playAudio: "Hear explanation", stopAudio: "Stop audio", transcript: "Transcript", audioMeaning: "The question asks what is inside a cell and how its nucleus organizes activity.",
    audioUnavailable: "Speech synthesis is unavailable in this browser. The transcript remains available.",
    audioError: "Speech playback failed. Use the transcript below.",
    mediaNote: "Animated vector model and browser speech synthesis; no external media is loaded.",
    recallTitle: "Two short recalls help learning last",
    recallPrinciple: "A question on day 2, then a quick application on day 7: learners actively retrieve the idea instead of just rereading it.",
    without: "No recall", with: "With recall", retention: "Illustrative retention", day2: "Recall question", day7: "Quick application", curveNote: "Illustrative sketch inspired by the forgetting curve; it does not predict any learner’s memory.",
  },
} as const;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

export default function InteractiveCognitiveGuide({ language = "en", className = "" }: InteractiveCognitiveGuideProps) {
  const [step, setStep] = useState<Step>(0);
  const [modelPlaying, setModelPlaying] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioMessage, setAudioMessage] = useState("");
  const speechRequest = useRef(0);
  const reducedMotion = useReducedMotion();
  const id = useId().replaceAll(":", "");
  const t = copy[language];

  useEffect(() => () => { speechRequest.current += 1; if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }, []);

  function selectStep(next: Step) {
    speechRequest.current += 1;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setAudioPlaying(false);
    setAudioMessage("");
    setModelPlaying(false);
    setStep(next);
  }

  function toggleSpeech() {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setAudioMessage(t.audioUnavailable);
      return;
    }
    if (audioPlaying) {
      speechRequest.current += 1;
      window.speechSynthesis.cancel();
      setAudioPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(darijaTranscript);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(voice => voice.lang.toLowerCase() === "ar-ma") ?? voices.find(voice => voice.lang.toLowerCase().startsWith("ar")) ?? null;
    utterance.lang = "ar-MA";
    utterance.rate = 0.86;
    const request = ++speechRequest.current;
    utterance.onend = () => { if (speechRequest.current === request) setAudioPlaying(false); };
    utterance.onerror = () => { if (speechRequest.current === request) { setAudioPlaying(false); setAudioMessage(t.audioError); } };
    setAudioMessage("");
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setAudioPlaying(true);
  }

  return <section className={`ph-cognitive-guide rounded-lg border border-[#E7E5E4] bg-[#FAFAF8] p-4 text-[#111111] sm:p-6 lg:p-8 ${className}`} aria-labelledby={`${id}-title`}>
    <div className="max-w-3xl">
      <p className="text-xs font-bold tracking-[.12em] text-[#8B4914]">{t.kicker}</p>
      <h3 id={`${id}-title`} className="mt-3 text-2xl font-bold leading-tight text-[#111111] sm:text-3xl">{t.title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#303030] sm:text-base">{t.intro}</p>
    </div>

    <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(260px,.8fr)_minmax(0,1.2fr)] lg:gap-7">
      <nav aria-label={t.choose}>
        <ol className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
          {t.steps.map((item, index) => {
            const active = step === index;
            return <li key={item.tag}>
              <button type="button" aria-pressed={active} aria-controls={`${id}-demo`} onClick={() => selectStep(index as Step)} className={`ph-guide-step flex min-h-28 w-full items-start gap-3 rounded-lg border p-4 text-start transition-colors focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#B5651D] md:min-h-36 lg:min-h-28 ${active ? "border-[#B5651D] bg-white" : "border-[#E7E5E4] bg-[#FAFAF8] hover:border-[#B5651D] hover:bg-white"}`}>
                <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-sm font-bold ${active ? "border-[#B5651D] bg-[#B5651D] text-[#111111]" : "border-[#B5651D] bg-white text-[#8B4914]"}`}>{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0"><span className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="text-base font-bold leading-snug text-[#111111]">{item.label}</span><span aria-hidden="true" className={`h-2 w-2 rounded-full ${active ? "bg-[#15803D]" : "border border-[#15803D] bg-white"}`} /></span><span className="mt-1 block text-[11px] font-bold tracking-wide text-[#8B4914]">{item.tag} · <bdi dir="ltr">{item.time}</bdi></span><span className="mt-2 block text-xs leading-5 text-[#303030]">{item.description}</span></span>
              </button>
            </li>;
          })}
        </ol>
      </nav>

      <div id={`${id}-demo`} role="region" aria-label={t.demonstration} className="ph-guide-demo min-w-0 rounded-lg border border-[#E7E5E4] bg-white p-4 sm:p-6">
        <p className="sr-only" aria-live="polite">{t.steps[step].label}</p>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7E5E4] pb-4 text-xs font-bold text-[#303030]"><span>{t.demonstration}</span><span className="rounded border border-[#E7E5E4] px-2 py-1">{t.lesson}</span></div>

        {step === 0 && <div className="ph-guide-reveal pt-5">
          <p className="text-xs font-bold tracking-wide text-[#8B4914]">{t.problem} · <bdi>{t.steps[0].time}</bdi></p>
          <h4 className="mt-2 text-xl font-bold leading-snug text-[#111111]">{t.focusTitle}</h4>
          <div className="mt-5 grid items-center gap-5 sm:grid-cols-[.8fr_1.2fr]">
            <svg viewBox="0 0 240 190" role="img" aria-label={`${t.leaf} · ${t.cells}`} className="mx-auto block w-full max-w-60">
              <path d="M24 153 H216 M120 153 V112" fill="none" stroke="#111111" strokeWidth="1.5" />
              <path d="M120 110 C44 105 52 31 121 28 C188 29 196 105 120 110Z" fill="#FAFAF8" stroke="#B5651D" strokeWidth="1.5" />
              <path d="M120 107 V39 M120 75 C97 59 82 55 69 54 M120 76 C146 56 163 53 177 55" fill="none" stroke="#15803D" strokeWidth="1.5" />
              <circle cx="91" cy="72" r="7" fill="white" stroke="#B5651D" strokeWidth="1.5" /><circle cx="118" cy="54" r="7" fill="white" stroke="#B5651D" strokeWidth="1.5" /><circle cx="150" cy="73" r="7" fill="white" stroke="#B5651D" strokeWidth="1.5" />
              <path d="M170 109 L189 132 H213" fill="none" stroke="#111111" strokeWidth="1.5" /><circle cx="170" cy="109" r="3" fill="#15803D" />
              <text x="152" y="147" fill="#111111" fontSize="12">{t.cells}</text>
            </svg>
            <div className="rounded-lg border border-[#B5651D] bg-[#FAFAF8] p-4"><p className="text-xs font-bold text-[#8B4914]">{t.autonomous}</p><p className="mt-2 text-lg font-semibold leading-relaxed text-[#111111]">{t.focusQuestion}</p></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded border border-[#E7E5E4] px-3 py-2">01 · {t.focusObserve}</span><span className="rounded border border-[#E7E5E4] px-3 py-2">02 · {t.focusHypothesis}</span></div>
          <p className="mt-5 border-s-2 border-[#15803D] ps-3 text-sm leading-6 text-[#303030]">{t.focusPrinciple}</p>
        </div>}

        {step === 1 && <div className="ph-guide-reveal pt-5">
          <p className="text-xs font-bold tracking-wide text-[#8B4914]">{t.steps[1].tag} · <bdi>{t.steps[1].time}</bdi></p>
          <h4 className="mt-2 text-xl font-bold leading-snug text-[#111111]">{t.dualTitle}</h4>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[#E7E5E4] bg-[#FAFAF8] p-4"><p className="text-xs font-bold text-[#8B4914]">{t.visual}</p>
              <div className="my-5 flex h-40 items-center justify-center overflow-hidden" role="img" aria-label={`${t.visual} : ${t.membrane}, ${t.nucleus}`}><div className={`ph-guide-cell ${modelPlaying && !reducedMotion ? "ph-guide-cell--playing" : ""}`}><span className="ph-guide-cell-core" /><span className="ph-guide-cell-orbit" /></div></div>
              <div className="flex justify-between text-xs text-[#303030]"><span>{t.membrane}</span><span>{t.nucleus}</span></div>
              <button type="button" aria-pressed={modelPlaying && !reducedMotion} disabled={reducedMotion} onClick={() => setModelPlaying(value => !value)} className="mt-4 min-h-11 w-full rounded-lg border border-[#111111] bg-white px-3 py-2 text-sm font-semibold text-[#111111] hover:bg-[#E7E5E4] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-4 focus-visible:outline-[#B5651D]">{modelPlaying && !reducedMotion ? t.pauseVisual : t.playVisual}</button>
            </div>
            <div className="rounded-lg border border-[#E7E5E4] bg-[#FAFAF8] p-4"><p className="text-xs font-bold text-[#8B4914]">{t.audio}</p>
              <div aria-hidden="true" className="my-5 flex h-40 items-center justify-center gap-1">{[24, 49, 32, 68, 42, 76, 38, 55, 28, 45, 23].map((height, i) => <span key={i} className={`w-1.5 rounded-sm ${audioPlaying && !reducedMotion ? "ph-guide-wave" : ""}`} style={{ height, background: i % 3 === 0 ? "#15803D" : "#B5651D", animationDelay: `${i * 80}ms` }} />)}</div>
              <p dir="rtl" lang="ar-MA" className="min-h-12 text-sm leading-6 text-[#111111]">{darijaTranscript}</p>
              <button type="button" aria-pressed={audioPlaying} onClick={toggleSpeech} className="mt-4 min-h-11 w-full rounded-lg border border-[#111111] bg-white px-3 py-2 text-sm font-semibold text-[#111111] hover:bg-[#E7E5E4] focus-visible:outline-4 focus-visible:outline-[#B5651D]">{audioPlaying ? t.stopAudio : t.playAudio}</button>
            </div>
          </div>
          {audioMessage && <p role="status" className="mt-3 text-sm text-[#8B4914]">{audioMessage}</p>}
          <p className="mt-4 text-xs leading-5 text-[#303030]"><strong>{t.transcript}.</strong> {t.audioMeaning}</p>
          <p className="mt-3 border-s-2 border-[#15803D] ps-3 text-sm leading-6 text-[#303030]">{t.dualPrinciple}</p>
          <p className="mt-3 text-xs leading-5 text-[#303030]">{t.mediaNote}</p>
        </div>}

        {step === 2 && <div className="ph-guide-reveal pt-5">
          <p className="text-xs font-bold tracking-wide text-[#8B4914]">{t.steps[2].tag} · <bdi dir="ltr">J+2 / J+7</bdi></p>
          <h4 className="mt-2 text-xl font-bold leading-snug text-[#111111]">{t.recallTitle}</h4>
          <div dir="ltr" className="mt-5 rounded-lg border border-[#E7E5E4] bg-[#FAFAF8] p-3 sm:p-5">
            <svg viewBox="0 0 440 230" role="img" aria-labelledby={`${id}-curve-title ${id}-curve-desc`} className="block w-full">
              <title id={`${id}-curve-title`}>{t.retention}</title><desc id={`${id}-curve-desc`}>{t.curveNote}</desc>
              {[48, 108, 168].map(y => <line key={y} x1="46" x2="414" y1={y} y2={y} stroke="#E7E5E4" strokeWidth="1" />)}
              <path d="M46 26 V186 H414" fill="none" stroke="#111111" strokeWidth="1.5" />
              <path d="M46 42 C105 103 171 148 414 174" fill="none" stroke="#777777" strokeWidth="2" strokeDasharray="5 6" />
              <path d="M46 42 C93 88 126 117 160 130 L160 57 C212 79 249 111 284 126 L284 57 C323 69 372 83 414 91" fill="none" stroke="#B5651D" strokeWidth="3" strokeLinejoin="round" />
              {[{ x: 46, label: "J0" }, { x: 160, label: "J+2" }, { x: 284, label: "J+7" }, { x: 414, label: "J+21" }].map(point => <g key={point.label}><line x1={point.x} x2={point.x} y1="186" y2="191" stroke="#111111" strokeWidth="1.5" /><text x={point.x} y="209" textAnchor="middle" fill="#111111" fontSize="12">{point.label}</text></g>)}
              <circle cx="160" cy="57" r="7" fill="#15803D" stroke="white" strokeWidth="2" /><circle cx="284" cy="57" r="7" fill="#15803D" stroke="white" strokeWidth="2" />
            </svg>
            <div className="mt-1 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold"><span className="flex items-center gap-2"><i className="w-6 border-t-2 border-dashed border-[#777777]" />{t.without}</span><span className="flex items-center gap-2"><i className="w-6 border-t-[3px] border-[#B5651D]" />{t.with}</span></div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2"><p className="rounded-lg border border-[#15803D] p-3 text-sm font-semibold"><bdi dir="ltr">J+2</bdi> · {t.day2}</p><p className="rounded-lg border border-[#15803D] p-3 text-sm font-semibold"><bdi dir="ltr">J+7</bdi> · {t.day7}</p></div>
          <p className="mt-4 border-s-2 border-[#15803D] ps-3 text-sm leading-6 text-[#303030]">{t.recallPrinciple}</p>
          <p className="mt-3 text-xs leading-5 text-[#303030]">{t.curveNote}</p>
        </div>}
      </div>
    </div>
    <style>{`
      .ph-guide-reveal { animation: ph-guide-appear .24s ease-out both; }
      @keyframes ph-guide-appear { from { opacity: .55; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      .ph-guide-cell { position: relative; width: 128px; height: 128px; border: 1.5px solid #B5651D; border-radius: 50%; background: #FFFFFF; transform: rotateX(24deg) rotateY(-20deg); transform-style: preserve-3d; }
      .ph-guide-cell::before, .ph-guide-cell::after { content: ""; position: absolute; inset: 13px; border: 1.5px solid #15803D; border-radius: 50%; transform: rotateY(62deg); }
      .ph-guide-cell::after { inset: 25px; border-color: #E7E5E4; transform: rotateX(65deg); }
      .ph-guide-cell-core { position: absolute; inset: 44px; z-index: 1; border: 1.5px solid #B5651D; border-radius: 50%; background: #FAFAF8; }
      .ph-guide-cell-orbit { position: absolute; z-index: 2; top: 16px; left: 28px; width: 9px; height: 9px; border-radius: 50%; background: #15803D; }
      .ph-guide-cell--playing { animation: ph-guide-turn 7s linear infinite; }
      @keyframes ph-guide-turn { from { transform: rotateX(24deg) rotateY(-20deg); } to { transform: rotateX(24deg) rotateY(340deg); } }
      .ph-guide-wave { animation: ph-guide-sound .8s ease-in-out infinite alternate; transform-origin: center; }
      @keyframes ph-guide-sound { to { transform: scaleY(.38); } }
      @media (prefers-reduced-motion: reduce) { .ph-guide-reveal, .ph-guide-cell--playing, .ph-guide-wave { animation: none !important; } }
    `}</style>
  </section>;
}
