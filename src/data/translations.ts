import type { LanguageCode } from '../types/language';

export interface PageGuidanceContent {
  title: string;
  guidanceText: string;
}

export interface UiTranslations {
  // Navigation & Voice Bar
  navHome: string;
  navActivities: string;
  navFamily: string;
  navProgress: string;
  navCaregiverHub: string;
  navPatientAnalytics: string;
  navFamilyMembers: string;
  navActivityLogs: string;
  navProfile: string;
  navLogout: string;
  contrast: string;
  selectLanguage: string;
  voiceGuidanceTitle: string;
  voiceGuidanceActive: string;
  autoSpeechOn: string;
  autoSpeechOff: string;
  listenPageGuidance: string;
  stopSpeech: string;
  voiceCommandPrompt: string;
  listeningVoiceCommand: string;
  voiceCommandSuccess: string;
  voiceCommandError: string;
  speakNow: string;

  // Auth & Login
  loginTitle: string;
  loginSubtitle: string;
  demoModeTitle: string;
  demoModeDesc: string;
  patientDemoBtn: string;
  caregiverDemoBtn: string;
  accountLoginTitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  signInBtn: string;
  authenticating: string;
  noAccount: string;
  createAccountLink: string;
  alreadyAccount: string;
  loginLink: string;
  signupTitle: string;
  nameLabel: string;
  namePlaceholder: string;
  roleLabel: string;
  patientRole: string;
  caregiverRole: string;
  linkedPatientLabel: string;
  signUpBtn: string;

  // Dashboard & Games
  welcomeBack: string;
  cognitiveActivities: string;
  familyRecognitionTitle: string;
  familyRecognitionDesc: string;
  memoryMatchTitle: string;
  memoryMatchDesc: string;
  patternRecallTitle: string;
  patternRecallDesc: string;
  recognitionQuizTitle: string;
  recognitionQuizDesc: string;
  startActivity: string;
  viewProgress: string;
  streakDays: string;
  accuracyScore: string;
  currentLevel: string;
  pairsCount: string;
  scoreLabel: string;
  mistakesLabel: string;
  timeLabel: string;
  goodMatch: string;
  tryAgain: string;
  restartActivity: string;
  backToDashboard: string;
  greatJob: string;
  activityComplete: string;

  // Caregiver
  caregiverHubTitle: string;
  clinicalAssessmentScore: string;
  cognitiveAlerts: string;
  emergencyContacts: string;
  addFamilyMember: string;
  activityAuditLog: string;
}

export const UI_TRANSLATIONS: Record<LanguageCode, UiTranslations> = {
  en: {
    navHome: 'Home',
    navActivities: 'Activities',
    navFamily: 'Family',
    navProgress: 'My Progress',
    navCaregiverHub: 'Caregiver Hub',
    navPatientAnalytics: 'Patient Analytics',
    navFamilyMembers: 'Family Members',
    navActivityLogs: 'Activity Logs',
    navProfile: 'Profile',
    navLogout: 'Sign Out',
    contrast: 'Contrast',
    selectLanguage: 'Language',
    voiceGuidanceTitle: 'Voice Guidance',
    voiceGuidanceActive: 'Speaking guidance...',
    autoSpeechOn: 'Auto Voice On',
    autoSpeechOff: 'Auto Voice Off',
    listenPageGuidance: 'Listen Page Guide',
    stopSpeech: 'Stop Speech',
    voiceCommandPrompt: 'Voice Command',
    listeningVoiceCommand: 'Listening for voice command...',
    voiceCommandSuccess: 'Command recognized!',
    voiceCommandError: 'Could not understand command.',
    speakNow: 'Speak clear command now',

    loginTitle: 'CogniCare Portal',
    loginSubtitle: 'Cognitive Care & Support Platform (SIH PS 26003)',
    demoModeTitle: 'Fast Demo Evaluation Mode',
    demoModeDesc: 'Click below for instant access with sample cognitive data, pre-populated family cards, and analytics.',
    patientDemoBtn: 'Patient Demo',
    caregiverDemoBtn: 'Caregiver Demo',
    accountLoginTitle: 'Account Login',
    emailLabel: 'Email Address',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    signInBtn: 'Sign In',
    authenticating: 'Authenticating...',
    noAccount: "Don't have an account?",
    createAccountLink: 'Create Account',
    alreadyAccount: 'Already have an account?',
    loginLink: 'Sign In',
    signupTitle: 'Create Account',
    nameLabel: 'Full Name',
    namePlaceholder: 'Your full name',
    roleLabel: 'I am a:',
    patientRole: 'Patient',
    caregiverRole: 'Caregiver',
    linkedPatientLabel: 'Patient Name to Support',
    signUpBtn: 'Create Account',

    welcomeBack: 'Welcome Back',
    cognitiveActivities: 'Daily Cognitive Exercises',
    familyRecognitionTitle: 'Family Recognition',
    familyRecognitionDesc: 'Practice recognizing loved ones and names',
    memoryMatchTitle: 'Memory Match',
    memoryMatchDesc: 'Remember and pair familiar pictures',
    patternRecallTitle: 'Pattern Recall',
    patternRecallDesc: 'Remember colored button sequences',
    recognitionQuizTitle: 'Object & Scene Quiz',
    recognitionQuizDesc: 'Identify objects and everyday scenes',
    startActivity: 'Start Activity',
    viewProgress: 'View Progress',
    streakDays: 'Daily Streak',
    accuracyScore: 'Overall Accuracy',
    currentLevel: 'Current Level',
    pairsCount: 'pairs',
    scoreLabel: 'Score',
    mistakesLabel: 'Mistakes',
    timeLabel: 'Time',
    goodMatch: '✓ Good match!',
    tryAgain: "Not a match. Let's try again.",
    restartActivity: 'Restart Activity',
    backToDashboard: 'Back to Home',
    greatJob: 'Great Job!',
    activityComplete: 'Activity Completed Successfully',

    caregiverHubTitle: 'Caregiver Clinical Hub',
    clinicalAssessmentScore: 'Clinical Score',
    cognitiveAlerts: 'Cognitive Alerts',
    emergencyContacts: 'Emergency Contacts',
    addFamilyMember: 'Add Family Member',
    activityAuditLog: 'Activity Audit Log',
  },
  ta: {
    navHome: 'முகப்பு',
    navActivities: 'விளையாட்டுகள்',
    navFamily: 'குடும்பம்',
    navProgress: 'எனது முன்னேற்றம்',
    navCaregiverHub: 'பராமரிப்பாளர் மையம்',
    navPatientAnalytics: 'நோயாளி பகுப்பாய்வு',
    navFamilyMembers: 'குடும்ப உறுப்பினர்கள்',
    navActivityLogs: 'செயல்பாட்டுப் பதிவுகள்',
    navProfile: 'சுயவிவரம்',
    navLogout: 'வெளியேறு',
    contrast: 'கான்ட்ராஸ்ட்',
    selectLanguage: 'மொழி',
    voiceGuidanceTitle: 'குரல் வழிகாட்டுதல்',
    voiceGuidanceActive: 'குரல் பேசுகிறது...',
    autoSpeechOn: 'தானியங்கி குரல் ஆன்',
    autoSpeechOff: 'தானியங்கி குரல் ஆஃப்',
    listenPageGuidance: 'வழிகாட்டலைக் கேள்',
    stopSpeech: 'பேச்சை நிறுத்து',
    voiceCommandPrompt: 'குரல் கட்டளை',
    listeningVoiceCommand: 'கட்டளையைக் கேட்கிறது...',
    voiceCommandSuccess: 'கட்டளை உணரப்பட்டது!',
    voiceCommandError: 'கட்டளை புரியவில்லை.',
    speakNow: 'இப்போது பேசுங்கள்',

    loginTitle: 'காக்னிகேர் தளம்',
    loginSubtitle: 'மனநல பராமரிப்பு மற்றும் ஆதரவு மையம்',
    demoModeTitle: 'விரைவு டெமோ பயன்முறை',
    demoModeDesc: 'மாதிரி தகவல்களுடன் உடனடியாக அணுக கீழே உள்ள டெமோ பொத்தானை அழுத்தவும்.',
    patientDemoBtn: 'நோயாளி டெமோ',
    caregiverDemoBtn: 'பராமரிப்பாளர் டெமோ',
    accountLoginTitle: 'கணக்கு உள்நுழைவு',
    emailLabel: 'மின்னஞ்சல் முகவரி',
    emailPlaceholder: 'பெயர்@எடுத்துக்காட்டு.com',
    passwordLabel: 'கடவுச்சொல்',
    passwordPlaceholder: '••••••••',
    signInBtn: 'உள்நுழை',
    authenticating: 'சரிபார்க்கிறது...',
    noAccount: 'கணக்கு இல்லையா?',
    createAccountLink: 'கணக்கை உருவாக்கு',
    alreadyAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
    loginLink: 'உள்நுழை',
    signupTitle: 'புதிய கணக்கு உருவாக்கு',
    nameLabel: 'முழு பெயர்',
    namePlaceholder: 'உங்கள் பெயர்',
    roleLabel: 'நான் ஒரு:',
    patientRole: 'நோயாளி',
    caregiverRole: 'பராமரிப்பாளர்',
    linkedPatientLabel: 'நோயாளி பெயர்',
    signUpBtn: 'கணக்கை உருவாக்கு',

    welcomeBack: 'மீண்டும் வருக',
    cognitiveActivities: 'தினசரி மனப்பயிற்சிகள்',
    familyRecognitionTitle: 'குடும்பத்தினர் அடையாளம்',
    familyRecognitionDesc: 'குடும்பத்தினர் மற்றும் பெயர்களை நினைவு கூருங்கள்',
    memoryMatchTitle: 'நினைவாற்றல் பொருத்துதல்',
    memoryMatchDesc: 'ஒரே மாதிரியான படங்களை சோடியாகப் பொருத்துங்கள்',
    patternRecallTitle: 'வண்ண வரிசை விளையாட்டு',
    patternRecallDesc: 'வண்ண வரிசையை நினைவில் வைத்து அழுத்தவும்',
    recognitionQuizTitle: 'பொருட்கள் வினாடி வினா',
    recognitionQuizDesc: 'பொருட்கள் மற்றும் இடங்களை அடையாளம் காணுங்கள்',
    startActivity: 'விளையாட்டைத் தொடங்கு',
    viewProgress: 'முன்னேற்றத்தைப் பார்',
    streakDays: 'தொடர் நாட்கள்',
    accuracyScore: 'துல்லிய மதிப்பெண்',
    currentLevel: 'தற்போதைய நிலை',
    pairsCount: 'ஜோடிகள்',
    scoreLabel: 'மதிப்பெண்',
    mistakesLabel: 'தவறுகள்',
    timeLabel: 'நேரம்',
    goodMatch: '✓ சரியான பொருத்தம்!',
    tryAgain: 'பொருந்தவில்லை. மீண்டும் முயற்சிக்கவும்.',
    restartActivity: 'மீண்டும் தொடங்கு',
    backToDashboard: 'முகப்புக்குச் செல்',
    greatJob: 'அற்புதமான ஆட்டம்!',
    activityComplete: 'விளையாட்டு வெற்றிகரமாக முடிந்தது',

    caregiverHubTitle: 'பராமரிப்பாளர் மையம்',
    clinicalAssessmentScore: 'மருத்துவ மதிப்பெண்',
    cognitiveAlerts: 'எச்சரிக்கைகள்',
    emergencyContacts: 'அவசர தொடர்புகள்',
    addFamilyMember: 'குடும்ப உறுப்பினரைச் சேர்',
    activityAuditLog: 'செயல்பாட்டுப் பதிவு',
  },
  hi: {
    navHome: 'होम',
    navActivities: 'गतिविधियां',
    navFamily: 'परिवार',
    navProgress: 'मेरी प्रगति',
    navCaregiverHub: 'केयरगिवर हब',
    navPatientAnalytics: 'मरीज़ विश्लेषण',
    navFamilyMembers: 'परिवार के सदस्य',
    navActivityLogs: 'गतिविधि लॉग',
    navProfile: 'प्रोफाइल',
    navLogout: 'साइन आउट',
    contrast: 'कंट्रास्ट',
    selectLanguage: 'भाषा',
    voiceGuidanceTitle: 'वॉयस गाइडेंस',
    voiceGuidanceActive: 'आवाज बोल रही है...',
    autoSpeechOn: 'ऑटो वॉयस चालू',
    autoSpeechOff: 'ऑटो वॉयस बंद',
    listenPageGuidance: 'गाइड सुनें',
    stopSpeech: 'आवाज रोकें',
    voiceCommandPrompt: 'वॉयस कमांड',
    listeningVoiceCommand: 'कमांड सुन रहे हैं...',
    voiceCommandSuccess: 'कमांड समझ आ गई!',
    voiceCommandError: 'कमांड समझ नहीं आई।',
    speakNow: 'अब बोलें',

    loginTitle: 'कॉग्निकेयर पोर्टल',
    loginSubtitle: 'मानसिक देखभाल और सहायता मंच',
    demoModeTitle: 'फास्ट डेमो मोड',
    demoModeDesc: 'सैंपल डेटा के साथ तुरंत शुरुआत करने के लिए नीचे डेमो बटन दबाएं।',
    patientDemoBtn: 'पेशेंट डेमो',
    caregiverDemoBtn: 'केयरगिवर डेमो',
    accountLoginTitle: 'अकाउंट लॉगिन',
    emailLabel: 'ईमेल पता',
    emailPlaceholder: 'नाम@उदाहरण.com',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: '••••••••',
    signInBtn: 'साइन इन करें',
    authenticating: 'सत्यापित हो रहा है...',
    noAccount: 'अकाउंट नहीं है?',
    createAccountLink: 'नया अकाउंट बनाएं',
    alreadyAccount: 'पहले से अकाउंट है?',
    loginLink: 'साइन इन',
    signupTitle: 'नया अकाउंट बनाएं',
    nameLabel: 'पूरा नाम',
    namePlaceholder: 'अपना नाम लिखें',
    roleLabel: 'मैं हूँ:',
    patientRole: 'पेशेंट (मरीज़)',
    caregiverRole: 'केयरगिवर (देखभालकर्ता)',
    linkedPatientLabel: 'मरीज़ का नाम',
    signUpBtn: 'अकाउंट बनाएं',

    welcomeBack: 'वापसी पर स्वागत है',
    cognitiveActivities: 'दैनिक दिमागी कसरत',
    familyRecognitionTitle: 'परिवार की पहचान',
    familyRecognitionDesc: 'अपने परिवार के सदस्यों और नाम को पहचानें',
    memoryMatchTitle: 'मेमोरी मैच',
    memoryMatchDesc: 'एक जैसी तस्वीरों के जोड़े मिलाएं',
    patternRecallTitle: 'पैटर्न याद रखें',
    patternRecallDesc: 'रंगों के क्रम को याद करके बटन दबाएं',
    recognitionQuizTitle: 'वस्तु और दृश्य क्विज',
    recognitionQuizDesc: 'चीजों और जगहों को पहचानें',
    startActivity: 'खेल शुरू करें',
    viewProgress: 'प्रगति देखें',
    streakDays: 'लगातार दिन',
    accuracyScore: 'सटीकता स्कोर',
    currentLevel: 'वर्तमान स्तर',
    pairsCount: 'जोड़े',
    scoreLabel: 'स्कोर',
    mistakesLabel: 'गलतियां',
    timeLabel: 'समय',
    goodMatch: '✓ सही जोड़ी मिलाई!',
    tryAgain: 'जोड़ी नहीं मिली। फिर से कोशिश करें।',
    restartActivity: 'फिर से शुरू करें',
    backToDashboard: 'होम पर वापस जाएं',
    greatJob: 'बहुत बढ़िया!',
    activityComplete: 'खेल सफलतापूर्वक पूरा हुआ',

    caregiverHubTitle: 'केयरगिवर क्लिनिकल हब',
    clinicalAssessmentScore: 'क्लिनिकल स्कोर',
    cognitiveAlerts: 'अलर्ट्स',
    emergencyContacts: 'आपातकालीन नंबर',
    addFamilyMember: 'सदस्य जोड़ें',
    activityAuditLog: 'गतिविधि लॉग',
  },
  te: {
    navHome: 'హోమ్',
    navActivities: 'కార్యకలాపాలు',
    navFamily: 'కుటుంబం',
    navProgress: 'నా పురోగతి',
    navCaregiverHub: 'సంరక్షకుల కేంద్రం',
    navPatientAnalytics: 'పేషెంట్ విశ్లేషణ',
    navFamilyMembers: 'కుటుంబ సభ్యులు',
    navActivityLogs: 'కార్యకలాపాల చిట్టా',
    navProfile: 'ప్రొఫైల్',
    navLogout: 'లాగ్ అవుట్',
    contrast: 'కాంట్రాస్ట్',
    selectLanguage: 'భాష',
    voiceGuidanceTitle: 'వాయిస్ మార్గదర్శకత్వం',
    voiceGuidanceActive: 'వాయిస్ మాట్లాడుతోంది...',
    autoSpeechOn: 'ఆటో వాయిస్ ఆన్',
    autoSpeechOff: 'ఆటో వాయిస్ ఆఫ్',
    listenPageGuidance: 'గైడ్ వినండి',
    stopSpeech: 'వాయిస్ ఆపండి',
    voiceCommandPrompt: 'వాయిస్ కమాండ్',
    listeningVoiceCommand: 'కమాండ్ వింటోంది...',
    voiceCommandSuccess: 'కమాండ్ గుర్తించబడింది!',
    voiceCommandError: 'కమాండ్ అర్థం కాలేదు.',
    speakNow: 'ఇప్పుడు మాట్లాడండి',

    loginTitle: 'కాగ్నికేర్ పోర్టల్',
    loginSubtitle: 'మానసిక ఆరోగ్య సంరక్షణ వేదిక',
    demoModeTitle: 'డెమో మోడ్',
    demoModeDesc: 'తక్షణమే ప్రారంభించడానికి డెమో బటన్‌ను నొక్కండి.',
    patientDemoBtn: 'పేషెంట్ డెమో',
    caregiverDemoBtn: 'కేర్‌గివర్ డెమో',
    accountLoginTitle: 'లాగిన్',
    emailLabel: 'ఈమెయిల్ చిరునామా',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'పాస్‌వర్డ్',
    passwordPlaceholder: '••••••••',
    signInBtn: 'లాగిన్ అవ్వండి',
    authenticating: 'పరిశీలిస్తోంది...',
    noAccount: 'ఖాతా లేదా?',
    createAccountLink: 'ఖాతా సృష్టించండి',
    alreadyAccount: 'ఖాతా ఉందా?',
    loginLink: 'లాగిన్',
    signupTitle: 'ఖాతా సృష్టించండి',
    nameLabel: 'పూర్తి పేరు',
    namePlaceholder: 'మీ పేరు',
    roleLabel: 'నేను:',
    patientRole: 'పేషెంట్',
    caregiverRole: 'కేర్‌గివర్',
    linkedPatientLabel: 'పేషెంట్ పేరు',
    signUpBtn: 'ఖాతా సృష్టించండి',

    welcomeBack: 'స్వాగతం',
    cognitiveActivities: 'మానసిక వ్యాయామాలు',
    familyRecognitionTitle: 'కుటుంబ సభ్యుల గుర్తింపు',
    familyRecognitionDesc: 'కుటుంబ సభ్యులను గుర్తించండి',
    memoryMatchTitle: 'మెమరీ మ్యాచ్',
    memoryMatchDesc: 'బొమ్మలను జత చేయండి',
    patternRecallTitle: 'ప్యాటర్న్ రికాల్',
    patternRecallDesc: 'రంగుల వరుసక్రమాన్ని గుర్తుంచుకోండి',
    recognitionQuizTitle: 'వస్తువుల గుర్తింపు క్విజ్',
    recognitionQuizDesc: 'వస్తువులను గుర్తించండి',
    startActivity: 'ఆట ప్రారంభించు',
    viewProgress: 'పురోగతి చూడండి',
    streakDays: 'వరుస రోజులు',
    accuracyScore: 'స్కోర్',
    currentLevel: 'స్థాయి',
    pairsCount: 'జతలు',
    scoreLabel: 'స్కోర్',
    mistakesLabel: 'తప్పులు',
    timeLabel: 'సమయం',
    goodMatch: '✓ సరియైన జత!',
    tryAgain: 'మళ్ళీ ప్రయత్నించండి.',
    restartActivity: 'మళ్ళీ ప్రారంభించు',
    backToDashboard: 'హోమ్‌కు వెళ్ళు',
    greatJob: 'శభాష్!',
    activityComplete: 'ఆట పూర్తయింది',

    caregiverHubTitle: 'సంరక్షకుల కేంద్రం',
    clinicalAssessmentScore: 'స్కోర్',
    cognitiveAlerts: 'అలర్ట్‌లు',
    emergencyContacts: 'ఎమర్జెన్సీ నంబర్లు',
    addFamilyMember: 'సభ్యుడిని చేర్చు',
    activityAuditLog: 'లాగ్స్',
  },
  kn: {
    navHome: 'ಮುಖಪುಟ',
    navActivities: 'ಚಟುವಟಿಕೆಗಳು',
    navFamily: 'ಕುಟುಂಬ',
    navProgress: 'ನನ್ನ ಪ್ರಗತಿ',
    navCaregiverHub: 'ಹೊಂದಾಣಿಕೆದಾರರ ಕೇಂದ್ರ',
    navPatientAnalytics: 'ರೋಗಿಯ ವಿಶ್ಲೇಷಣೆ',
    navFamilyMembers: 'ಕುಟುಂಬದ ಸದಸ್ಯರು',
    navActivityLogs: 'ಚಟುವಟಿಕೆ ದಾಖಲೆಗಳು',
    navProfile: 'ಪ್ರೊಫೈಲ್',
    navLogout: 'ನಿರ್ಗಮಿಸಿ',
    contrast: 'ಕಾಂತಿರಹಿತ',
    selectLanguage: 'ಭಾಷೆ',
    voiceGuidanceTitle: 'ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ',
    voiceGuidanceActive: 'ಧ್ವನಿ ಮಾತನಾಡುತ್ತಿದೆ...',
    autoSpeechOn: 'ಆಟೋ ವಾಯ್ಸ್ ಆನ್',
    autoSpeechOff: 'ಆಟೋ ವಾಯ್ಸ್ ಆಫ್',
    listenPageGuidance: 'ಮಾರ್ಗದರ್ಶಿ ಕೇಳಿ',
    stopSpeech: 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ',
    voiceCommandPrompt: 'ಧ್ವನಿ ಆದೇಶ',
    listeningVoiceCommand: 'ಆದೇಶ ಆಲಿಸಲಾಗುತ್ತಿದೆ...',
    voiceCommandSuccess: 'ಆದೇಶ ಗುರುತಿಸಲಾಗಿದೆ!',
    voiceCommandError: 'ಆದೇಶ ಅರ್ಥವಾಗಲಿಲ್ಲ.',
    speakNow: 'ಈಗ ಮಾತನಾಡಿ',

    loginTitle: 'ಕಾಗ್ನಿಕೇರ್ ಪೋರ್ಟಲ್',
    loginSubtitle: 'ಮಾನಸಿಕ ಆರೋಗ್ಯ ಬೆಂಬಲ ವೇದಿಕೆ',
    demoModeTitle: 'ಡೆಮೊ ಮೋಡ್',
    demoModeDesc: 'ತಕ್ಷಣದ ಪ್ರವೇಶಕ್ಕಾಗಿ ಡೆಮೊ ಬಟನ್ ಒತ್ತಿ.',
    patientDemoBtn: 'ರೋಗಿ ಡೆಮೊ',
    caregiverDemoBtn: 'ಪಾಲಕ ಡೆಮೊ',
    accountLoginTitle: 'ಲಾಗಿನ್',
    emailLabel: 'ಇಮೇಲ್ ವಿಳಾಸ',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'ಪಾಸ್‌ವರ್ಡ್',
    passwordPlaceholder: '••••••••',
    signInBtn: 'ಲಾಗಿನ್ ಮಾಡಿ',
    authenticating: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    noAccount: 'ಖಾತೆ ಇಲ್ಲವೇ?',
    createAccountLink: 'ಖಾತೆ ರಚಿಸಿ',
    alreadyAccount: 'ಖಾತೆ ಇದೆಯೇ?',
    loginLink: 'ಲಾಗಿನ್',
    signupTitle: 'ಖಾತೆ ರಚಿಸಿ',
    nameLabel: 'ಪೂರ್ಣ ಹೆಸರು',
    namePlaceholder: 'ನಿಮ್ಮ ಹೆಸರು',
    roleLabel: 'ನಾನು:',
    patientRole: 'ರೋಗಿ',
    caregiverRole: 'ಪಾಲಕರು',
    linkedPatientLabel: 'ರೋಗಿಯ ಹೆಸರು',
    signUpBtn: 'ಖಾತೆ ರಚಿಸಿ',

    welcomeBack: 'ಸುಸ್ವಾಗತ',
    cognitiveActivities: 'ಮೆದುಳಿನ ಆಟಗಳು',
    familyRecognitionTitle: 'ಕುಟುಂಬದವರ ಗುರುತಿಸುವಿಕೆ',
    familyRecognitionDesc: 'ಕುಟುಂಬದವರನ್ನು ಗುರುತಿಸಿ',
    memoryMatchTitle: 'ಮೆಮೊರಿ ಮ್ಯಾಚ್',
    memoryMatchDesc: 'ಚಿತ್ರಗಳನ್ನು ಜೋಡಿಸಿ',
    patternRecallTitle: 'ಪ್ಯಾಟರ್ನ್ ರಿಕಾಲ್',
    patternRecallDesc: 'ಬಣ್ಣಗಳ ಕ್ರಮವನ್ನು ನೆನಪಿಡಿ',
    recognitionQuizTitle: 'ವಸ್ತು ಗುರುತಿಸುವಿಕೆ',
    recognitionQuizDesc: 'ವಸ್ತುಗಳನ್ನು ಗುರುತಿಸಿ',
    startActivity: 'ಆಟ ಪ್ರಾರಂಭಿಸಿ',
    viewProgress: 'ಪ್ರಗತಿ ನೋಡಿ',
    streakDays: 'ದಿನಗಳು',
    accuracyScore: 'ಅಂಕ',
    currentLevel: 'ಮಟ್ಟ',
    pairsCount: 'ಜೋಡಿಗಳು',
    scoreLabel: 'ಅಂಕ',
    mistakesLabel: 'ತಪ್ಪುಗಳು',
    timeLabel: 'ಸಮಯ',
    goodMatch: '✓ ಸರಿ ಜೋಡಿ!',
    tryAgain: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    restartActivity: 'ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ',
    backToDashboard: 'ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ',
    greatJob: 'ಉತ್ತಮ ಆಟ!',
    activityComplete: 'ಆಟ ಪೂರ್ಣಗೊಂಡಿದೆ',

    caregiverHubTitle: 'ಪಾಲಕರ ಕೇಂದ್ರ',
    clinicalAssessmentScore: 'ಅಂಕ',
    cognitiveAlerts: 'ಅಲರ್ಟ್‌ಗಳು',
    emergencyContacts: 'ತುರ್ತು ಸಂಪರ್ಕ',
    addFamilyMember: 'ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ',
    activityAuditLog: 'ದಾಖಲೆಗಳು',
  },
  ml: {
    navHome: 'ഹോം',
    navActivities: 'പ്രവർത്തനങ്ങൾ',
    navFamily: 'കുടുംബം',
    navProgress: 'എന്റെ പുരോഗതി',
    navCaregiverHub: 'പരിപാലക കേന്ദ്രം',
    navPatientAnalytics: 'രോഗി വിശകലനം',
    navFamilyMembers: 'കുടുംബാംഗങ്ങൾ',
    navActivityLogs: 'പ്രവർത്തന ലോഗുകൾ',
    navProfile: 'പ്രൊഫൈൽ',
    navLogout: 'സൈൻ ഔട്ട്',
    contrast: 'കോൺട്രാസ്റ്റ്',
    selectLanguage: 'ഭാഷ',
    voiceGuidanceTitle: 'ശബ്ദ മാർഗ്ഗനിർദ്ദേശം',
    voiceGuidanceActive: 'ശബ്ദം സംസാരിക്കുന്നു...',
    autoSpeechOn: 'ഓട്ടോ വോയ്‌സ് ഓൺ',
    autoSpeechOff: 'ഓട്ടോ വോയ്‌സ് ഓഫ്',
    listenPageGuidance: 'ഗൈഡ് കേൾക്കുക',
    stopSpeech: 'സംസാരം നിർത്തുക',
    voiceCommandPrompt: 'വോയ്‌സ് കമാൻഡ്',
    listeningVoiceCommand: 'കമാൻഡ് കേൾക്കുന്നു...',
    voiceCommandSuccess: 'കമാൻഡ് തിരിച്ചറിഞ്ഞു!',
    voiceCommandError: 'കമാൻഡ് മനസ്സിലായില്ല.',
    speakNow: 'സംസാരിക്കുക',

    loginTitle: 'കോഗ്നികെയർ പോർട്ടൽ',
    loginSubtitle: 'ആരോഗ്യ പരിപാലന സഹായി',
    demoModeTitle: 'ഡെമോ മോഡ്',
    demoModeDesc: 'ഡെമോ ബട്ടൺ ഉപയോഗിച്ച് ലോഗിൻ ചെയ്യുക.',
    patientDemoBtn: 'രോഗി ഡെമോ',
    caregiverDemoBtn: 'പരിപാലകൻ ഡെമോ',
    accountLoginTitle: 'ലോഗിൻ',
    emailLabel: 'ഇമെയിൽ വിലാസം',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'പാസ്‌വേഡ്',
    passwordPlaceholder: '••••••••',
    signInBtn: 'ലോഗിൻ ചെയ്യുക',
    authenticating: 'പരിശോധിക്കുന്നു...',
    noAccount: 'അക്കൗണ്ട് ഇല്ലേ?',
    createAccountLink: 'അക്കൗണ്ട് ഉണ്ടാക്കുക',
    alreadyAccount: 'അക്കൗണ്ട് ഉണ്ടോ?',
    loginLink: 'ലോഗിൻ',
    signupTitle: 'അക്കൗണ്ട് ഉണ്ടാക്കുക',
    nameLabel: 'പൂർണ്ണ നാമം',
    namePlaceholder: 'പേര് നൽകുക',
    roleLabel: 'ഞാൻ:',
    patientRole: 'രോഗി',
    caregiverRole: 'പരിപാലകൻ',
    linkedPatientLabel: 'രോഗിയുടെ പേര്',
    signUpBtn: 'രജിസ്റ്റർ ചെയ്യുക',

    welcomeBack: 'സ്വാഗതം',
    cognitiveActivities: 'മനസ്സിന്റെ വ്യായാമം',
    familyRecognitionTitle: 'കുടുംബാംഗങ്ങൾ',
    familyRecognitionDesc: 'കുടുംബാംഗങ്ങളെ തിരിച്ചറിയുക',
    memoryMatchTitle: 'മെമ്മറി മാച്ച്',
    memoryMatchDesc: 'ചിത്രങ്ങൾ ജോടിയാക്കുക',
    patternRecallTitle: 'പാറ്റേൺ റീക്കോൾ',
    patternRecallDesc: 'നിറങ്ങളുടെ ക്രമം ഓർമ്മിക്കുക',
    recognitionQuizTitle: 'വസ്തു തിരിച്ചറിയൽ',
    recognitionQuizDesc: 'വസ്തുക്കളെ തിരിച്ചറിയുക',
    startActivity: 'കളി തുടങ്ങുക',
    viewProgress: 'പുരോഗതി കാണുക',
    streakDays: 'ദിവസങ്ങൾ',
    accuracyScore: 'സ്കോർ',
    currentLevel: 'ലെവൽ',
    pairsCount: 'ജോടികൾ',
    scoreLabel: 'സ്കോർ',
    mistakesLabel: 'തെറ്റുകൾ',
    timeLabel: 'സമയം',
    goodMatch: '✓ ശരിയായ ജോടി!',
    tryAgain: 'വീണ്ടും ശ്രമിക്കുക.',
    restartActivity: 'വീണ്ടും തുടങ്ങുക',
    backToDashboard: 'ഹോമിലേക്ക് മടങ്ങുക',
    greatJob: 'നന്നായി ചെയ്തു!',
    activityComplete: 'പൂർത്തിയായി',

    caregiverHubTitle: 'പരിപാലക കേന്ദ്രം',
    clinicalAssessmentScore: 'സ്കോർ',
    cognitiveAlerts: 'അറിയിപ്പുകൾ',
    emergencyContacts: 'അടിയന്തര നമ്പറുകൾ',
    addFamilyMember: 'അംഗത്തെ ചേർക്കുക',
    activityAuditLog: 'ലോഗുകൾ',
  },
  bn: {
    navHome: 'হোম',
    navActivities: 'কার্যক্রম',
    navFamily: 'পরিবার',
    navProgress: 'আমার অগ্রগতি',
    navCaregiverHub: 'কেয়ারগিভার হাব',
    navPatientAnalytics: 'রোগীর বিশ্লেষণ',
    navFamilyMembers: 'পরিবারের সদস্য',
    navActivityLogs: 'অ্যাক্টিভিটি লগ',
    navProfile: 'প্রোফাইল',
    navLogout: 'সাইন আউট',
    contrast: 'কনট্রাস্ট',
    selectLanguage: 'ভাষা',
    voiceGuidanceTitle: 'ভয়েস নির্দেশনা',
    voiceGuidanceActive: 'ভয়েস বলছে...',
    autoSpeechOn: 'অটো ভয়েস অন',
    autoSpeechOff: 'অটো ভয়েস অফ',
    listenPageGuidance: 'গাইড শুনুন',
    stopSpeech: 'কথা বন্ধ করুন',
    voiceCommandPrompt: 'ভয়েস কমান্ড',
    listeningVoiceCommand: 'কমান্ড শোনা হচ্ছে...',
    voiceCommandSuccess: 'কমান্ড বোঝা গেছে!',
    voiceCommandError: 'কমান্ড বোঝা যায়নি।',
    speakNow: 'এখন বলুন',

    loginTitle: 'কগনিকেয়ার পোর্টাল',
    loginSubtitle: 'মানসিক স্বাস্থ্য সহায়তা প্ল্যাটফর্ম',
    demoModeTitle: 'ডেমো মোড',
    demoModeDesc: 'ডেমো বোতাম ব্যবহার করে প্রবেশ করুন।',
    patientDemoBtn: 'রোগীর ডেমো',
    caregiverDemoBtn: 'যত্নকারীর ডেমো',
    accountLoginTitle: 'লগইন',
    emailLabel: 'ইমেল ঠিকানা',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'পাসওয়ার্ড',
    passwordPlaceholder: '••••••••',
    signInBtn: 'লগইন করুন',
    authenticating: 'পরীক্ষা করা হচ্ছে...',
    noAccount: 'অ্যাকাউন্ট নেই?',
    createAccountLink: 'অ্যাকাউন্ট তৈরি করুন',
    alreadyAccount: 'অ্যাকাউন্ট আছে?',
    loginLink: 'লগইন',
    signupTitle: 'অ্যাকাউন্ট তৈরি করুন',
    nameLabel: 'পূর্ণ নাম',
    namePlaceholder: 'আপনার নাম লিখুন',
    roleLabel: 'আমি একজন:',
    patientRole: 'রোগী',
    caregiverRole: 'যত্নকারী',
    linkedPatientLabel: 'রোগীর নাম',
    signUpBtn: 'তৈরি করুন',

    welcomeBack: 'স্বাগতম',
    cognitiveActivities: 'মানসিক ব্যায়াম গেম',
    familyRecognitionTitle: 'পরিবারের স্বজনদের চেনা',
    familyRecognitionDesc: 'পরিবারের সদস্যদের চিনুন',
    memoryMatchTitle: 'মেমোরি ম্যাচ',
    memoryMatchDesc: 'ছবি মেলান',
    patternRecallTitle: 'প্যাটার্ন রিকল',
    patternRecallDesc: 'রঙের ক্রম মনে রাখুন',
    recognitionQuizTitle: 'বস্তু সনাক্তকরণ',
    recognitionQuizDesc: 'বস্তু চিনুন',
    startActivity: 'গেম শুরু করুন',
    viewProgress: 'অগ্রগতি দেখুন',
    streakDays: 'দিনসমূহ',
    accuracyScore: 'স্কোর',
    currentLevel: 'লেভেল',
    pairsCount: 'জোড়া',
    scoreLabel: 'স্কোর',
    mistakesLabel: 'ভুল',
    timeLabel: 'সময়',
    goodMatch: '✓ সঠিক মেলা!',
    tryAgain: 'আবার চেষ্টা করুন।',
    restartActivity: 'পুনরায় শুরু করুন',
    backToDashboard: 'হোমে ফিরে যান',
    greatJob: 'খুব ভালো!',
    activityComplete: 'সম্পূর্ণ হয়েছে',

    caregiverHubTitle: 'কেয়ারগিভার ড্যাশবোর্ড',
    clinicalAssessmentScore: 'স্কোর',
    cognitiveAlerts: 'অ্যালার্ট',
    emergencyContacts: 'জরুরী নম্বর',
    addFamilyMember: 'সদস্য যোগ করুন',
    activityAuditLog: 'লগ',
  },
  mr: {
    navHome: 'होम',
    navActivities: 'उपक्रम',
    navFamily: 'कुटुंब',
    navProgress: 'माझी प्रगती',
    navCaregiverHub: 'केअरगिव्हर हब',
    navPatientAnalytics: 'रुग्ण विश्लेषण',
    navFamilyMembers: 'कुटुंबातील सदस्य',
    navActivityLogs: 'अ‍ॅक्टिव्हिटी लॉग',
    navProfile: 'प्रोफाइल',
    navLogout: 'साइन आउट',
    contrast: 'कंट्रास्ट',
    selectLanguage: 'भाषा',
    voiceGuidanceTitle: 'व्हॉइस मार्गदर्शन',
    voiceGuidanceActive: 'आवाज बोलत आहे...',
    autoSpeechOn: 'ऑटो व्हॉइस चालू',
    autoSpeechOff: 'ऑटो व्हॉइस बंद',
    listenPageGuidance: 'गाइड ऐका',
    stopSpeech: 'आवाज थांबवा',
    voiceCommandPrompt: 'व्हॉइस कमांड',
    listeningVoiceCommand: 'कमांड ऐकत आहे...',
    voiceCommandSuccess: 'कमांड समजली!',
    voiceCommandError: 'कमांड समजली नाही.',
    speakNow: 'आता बोला',

    loginTitle: 'कॉग्निकेअर पोर्टल',
    loginSubtitle: 'मानसिक काळजी आणि समर्थन व्यासपीठ',
    demoModeTitle: 'डेमो मोड',
    demoModeDesc: 'डेमो बटण वापरून लॉगिन करा.',
    patientDemoBtn: 'रुग्ण डेमो',
    caregiverDemoBtn: 'केअरगिव्हर डेमो',
    accountLoginTitle: 'लॉगिन',
    emailLabel: 'ईमेल पत्ता',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: '••••••••',
    signInBtn: 'लॉगिन करा',
    authenticating: 'तपासत आहे...',
    noAccount: 'खाते नाही?',
    createAccountLink: 'नवीन खाते तयार करा',
    alreadyAccount: 'खाते आहे?',
    loginLink: 'लॉगिन',
    signupTitle: 'नवीन खाते तयार करा',
    nameLabel: 'पूर्ण नाव',
    namePlaceholder: 'तुमचे नाव',
    roleLabel: 'मी आहे:',
    patientRole: 'रुग्ण',
    caregiverRole: 'केअरगिव्हर',
    linkedPatientLabel: 'रुग्णाचे नाव',
    signUpBtn: 'खाते तयार करा',

    welcomeBack: 'स्वागत आहे',
    cognitiveActivities: 'दैनिक मानसिक सराव',
    familyRecognitionTitle: 'कुटुंबातील सदस्यांची ओळख',
    familyRecognitionDesc: 'नातेवाईकांना ओळखा',
    memoryMatchTitle: 'मेमरी मॅच',
    memoryMatchDesc: 'चित्रांच्या जोड्या जुळवा',
    patternRecallTitle: 'पॅटर्न रिकॉल',
    patternRecallDesc: 'रंगांचा क्रम लक्षात ठेवा',
    recognitionQuizTitle: 'वस्तु ओळख क्विझ',
    recognitionQuizDesc: 'वस्तू ओळखा',
    startActivity: 'खेळ सुरू करा',
    viewProgress: 'प्रगती पहा',
    streakDays: 'दिवस',
    accuracyScore: 'स्कोअर',
    currentLevel: 'पातळी',
    pairsCount: 'जोड्या',
    scoreLabel: 'स्कोअर',
    mistakesLabel: 'चुका',
    timeLabel: 'वेळ',
    goodMatch: '✓ योग्य जोडी!',
    tryAgain: 'पुन्हा प्रयत्न करा.',
    restartActivity: 'पुन्हा सुरू करा',
    backToDashboard: 'मुख्य पानावर जा',
    greatJob: 'खूप छान!',
    activityComplete: 'पूर्ण झाले',

    caregiverHubTitle: 'केअरगिव्हर हब',
    clinicalAssessmentScore: 'स्कोअर',
    cognitiveAlerts: 'अलर्ट्स',
    emergencyContacts: 'आपत्कालीन संपर्क',
    addFamilyMember: 'सदस्य जोडा',
    activityAuditLog: 'लॉग्स',
  },
  gu: {
    navHome: 'હોમ',
    navActivities: 'પ્રવૃત્તિઓ',
    navFamily: 'પરિવાર',
    navProgress: 'મારી પ્રગતિ',
    navCaregiverHub: 'કેરગીવર હબ',
    navPatientAnalytics: 'દર્દી વિશ્લેષણ',
    navFamilyMembers: 'પરિવારના સભ્યો',
    navActivityLogs: 'પ્રવૃત્તિ લોગ',
    navProfile: 'પ્રોફાઇલ',
    navLogout: 'સાઇન આઉટ',
    contrast: 'કોન્ટ્રાસ્ટ',
    selectLanguage: 'ભાષા',
    voiceGuidanceTitle: 'વોઇસ માર્ગદર્શન',
    voiceGuidanceActive: 'અવાજ બોલી રહ્યો છે...',
    autoSpeechOn: 'ઓટો વોઇસ ચાલુ',
    autoSpeechOff: 'ઓટો વોઇસ બંધ',
    listenPageGuidance: 'ગાઇડ સાંભળો',
    stopSpeech: 'અવાજ રોકો',
    voiceCommandPrompt: 'વોઇસ કમાન્ડ',
    listeningVoiceCommand: 'કમાન્ડ સાંભળી રહ્યા છીએ...',
    voiceCommandSuccess: 'કમાન્ડ મળી ગઇ!',
    voiceCommandError: 'કમાન્ડ સમજાઇ નહીં.',
    speakNow: 'હવે બોલો',

    loginTitle: 'કોગ્નિબેર પોર્ટલ',
    loginSubtitle: 'માનસિક સંભાળ પ્લેટફોર્મ',
    demoModeTitle: 'ડેમો મોડ',
    demoModeDesc: 'ડેમો બટન દબાવીને શરુ કરો.',
    patientDemoBtn: 'દર્દી ડેમો',
    caregiverDemoBtn: 'કેરગીવર ડેમો',
    accountLoginTitle: 'લોગિન',
    emailLabel: 'ઇમેઇલ સરનામું',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'પાસવર્ડ',
    passwordPlaceholder: '••••••••',
    signInBtn: 'લોગિન કરો',
    authenticating: 'ચકાસી રહ્યું છે...',
    noAccount: 'ખાતું નથી?',
    createAccountLink: 'નવું ખાતું બનાવો',
    alreadyAccount: 'ખાતું છે?',
    loginLink: 'લોગિન',
    signupTitle: 'નવું ખાતું બનાવો',
    nameLabel: 'પૂરું નામ',
    namePlaceholder: 'તમારું નામ',
    roleLabel: 'હું છું:',
    patientRole: 'દર્દી',
    caregiverRole: 'કેરગીવર',
    linkedPatientLabel: 'દર્દીનું નામ',
    signUpBtn: 'ખાતું બનાવો',

    welcomeBack: 'સ્વાગત છે',
    cognitiveActivities: 'માનસિક કસરત ગેમ્સ',
    familyRecognitionTitle: 'પરિવારની ઓળખ',
    familyRecognitionDesc: 'સ્વજનોને ઓળખો',
    memoryMatchTitle: 'મેમરી મેચ',
    memoryMatchDesc: 'ચિત્રો જોડો',
    patternRecallTitle: 'પેટર્ન રીકોલ',
    patternRecallDesc: 'રંગોનો ક્રમ યાદ રાખો',
    recognitionQuizTitle: 'વસ્તુ ઓળખ ક્વિઝ',
    recognitionQuizDesc: 'વસ્તુઓ ઓળખો',
    startActivity: 'ગેમ શરૂ કરો',
    viewProgress: 'પ્રોગ્રેસ જુઓ',
    streakDays: 'દિવસો',
    accuracyScore: 'સ્કોર',
    currentLevel: 'લેવલ',
    pairsCount: 'જોડીઓ',
    scoreLabel: 'સ્કોર',
    mistakesLabel: 'ભૂલો',
    timeLabel: 'સમય',
    goodMatch: '✓ સાચી જોડી!',
    tryAgain: 'ફરી પ્રયાસ કરો.',
    restartActivity: 'ફરી શરૂ કરો',
    backToDashboard: 'હોમ પર પાછા જાઓ',
    greatJob: 'ખૂબ સરસ!',
    activityComplete: 'પૂર્ણ થયું',

    caregiverHubTitle: 'કેરગીવર ડેશબોર્ડ',
    clinicalAssessmentScore: 'સ્કોર',
    cognitiveAlerts: 'એલેર્ટ્સ',
    emergencyContacts: 'ઇમરજન્સી નંબરો',
    addFamilyMember: 'સભ્ય ઉમેરો',
    activityAuditLog: 'લોગ',
  },
  pa: {
    navHome: 'ਹੋਮ',
    navActivities: 'ਗਤੀਵਿਧੀਆਂ',
    navFamily: 'ਪਰਿਵਾਰ',
    navProgress: 'ਮੇਰੀ ਤਰੱਕੀ',
    navCaregiverHub: 'ਕੇਅਰਗਿਵਰ ਹਬ',
    navPatientAnalytics: 'ਮਰੀਜ਼ ਵਿਸ਼ਲੇਸ਼ਣ',
    navFamilyMembers: 'ਪਰਿਵਾਰ ਦੇ ਮੈਂਬਰ',
    navActivityLogs: 'ਗਤੀਵਿਧੀ ਲੌਗ',
    navProfile: 'ਪ੍ਰੋਫਾਈਲ',
    navLogout: 'ਸਾਈਨ ਆਊਟ',
    contrast: 'ਕੰਟ੍ਰਾਸਟ',
    selectLanguage: 'ਭਾਸ਼ਾ',
    voiceGuidanceTitle: 'ਵਾਇਸ ਮਾਰਗਦਰਸ਼ਨ',
    voiceGuidanceActive: 'ਆਵਾਜ਼ ਬੋਲ ਰਹੀ ਹੈ...',
    autoSpeechOn: 'ਆਟੋ ਵਾਇਸ ਚਾਲੂ',
    autoSpeechOff: 'ਆਟੋ ਵਾਇਸ ਬੰਦ',
    listenPageGuidance: 'ਗਾਈਡ ਸੁਣੋ',
    stopSpeech: 'ਆਵਾਜ਼ ਰੋਕੋ',
    voiceCommandPrompt: 'ਵਾਇਸ ਕਮਾਂਡ',
    listeningVoiceCommand: 'ਕਮਾਂਡ ਸੁਣ ਰਹੇ ਹਾਂ...',
    voiceCommandSuccess: 'ਕਮਾਂਡ ਸਮਝ ਆ ਗਈ!',
    voiceCommandError: 'ਕਮਾਂਡ ਸਮਝ ਨਹੀਂ ਆਈ।',
    speakNow: 'ਹੁਣ ਬੋਲੋ',

    loginTitle: 'ਕੌਗਨੀਕੇਅਰ ਪੋਰਟਲ',
    loginSubtitle: 'ਦਿਮਾਗੀ ਦੇਖਭਾਲ ਮੰਚ',
    demoModeTitle: 'ਡੈਮੋ ਮੋਡ',
    demoModeDesc: 'ਡੈਮੋ ਬਟਨ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ।',
    patientDemoBtn: 'ਮਰੀਜ਼ ਡੈਮੋ',
    caregiverDemoBtn: 'ਕੇਅਰਗਿਵਰ ਡੈਮੋ',
    accountLoginTitle: 'ਲੌਗਇਨ',
    emailLabel: 'ਈਮੇਲ ਪਤਾ',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'ਪਾਸਵਰਡ',
    passwordPlaceholder: '••••••••',
    signInBtn: 'ਲੌਗਇਨ ਕਰੋ',
    authenticating: 'ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ...',
    noAccount: 'ਖਾਤਾ ਨਹੀਂ ਹੈ?',
    createAccountLink: 'ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ',
    alreadyAccount: 'ਖਾਤਾ ਹੈ?',
    loginLink: 'ਲੌਗਇਨ',
    signupTitle: 'ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ',
    nameLabel: 'ਪੂਰਾ ਨਾਮ',
    namePlaceholder: 'ਆਪਣਾ ਨਾਮ ਲਿਖੋ',
    roleLabel: 'ਮੈਂ ਹਾਂ:',
    patientRole: 'ਮਰੀਜ਼',
    caregiverRole: 'ਕੇਅਰਗਿਵਰ',
    linkedPatientLabel: 'ਮਰੀਜ਼ ਦਾ ਨਾਮ',
    signUpBtn: 'ਖਾਤਾ ਬਣਾਓ',

    welcomeBack: 'ਜੀ ਆਇਆਂ ਨੂੰ',
    cognitiveActivities: 'ਦਿਮਾਗੀ ਖੇਡਾਂ',
    familyRecognitionTitle: 'ਪਰਿਵਾਰ ਦੀ ਪਛਾਣ',
    familyRecognitionDesc: 'ਰਿਸ਼ਤੇਦਾਰਾਂ ਨੂੰ ਪਛਾਣੋ',
    memoryMatchTitle: 'ਮੈਮੋਰੀ ਮੈਚ',
    memoryMatchDesc: 'ਤਸਵੀਰਾਂ ਮਿਲਾਓ',
    patternRecallTitle: 'ਪੈਟਰਨ ਰੀਕਾਲ',
    patternRecallDesc: 'ਰੰਗਾਂ ਦਾ ਕ੍ਰਮ ਯਾਦ ਰੱਖੋ',
    recognitionQuizTitle: 'ਵਸਤੂ ਪਛਾਣ ਕਵਿਜ਼',
    recognitionQuizDesc: 'ਚੀਜ਼ਾਂ ਪਛਾਣੋ',
    startActivity: 'ਖੇਡ ਸ਼ੁਰੂ ਕਰੋ',
    viewProgress: 'ਤਰੱਕੀ ਵੇਖੋ',
    streakDays: 'ਦਿਨ',
    accuracyScore: 'ਸਕੋਰ',
    currentLevel: 'ਲੇਵਲ',
    pairsCount: 'ਜੋੜੇ',
    scoreLabel: 'ਸਕੋਰ',
    mistakesLabel: 'ਗਲਤੀਆਂ',
    timeLabel: 'ਸਮਾਂ',
    goodMatch: '✓ ਸਹੀ ਜੋੜਾ!',
    tryAgain: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    restartActivity: 'ਮੁੜ ਸ਼ੁਰੂ ਕਰੋ',
    backToDashboard: 'ਹੋਮ ਤੇ ਵਾਪਸ ਜਾਓ',
    greatJob: 'ਬਹੁਤ ਵਧੀਆ!',
    activityComplete: 'ਪੂਰਾ ਹੋ ਗਿਆ',

    caregiverHubTitle: 'ਕੇਅਰਗਿਵਰ ਹਬ',
    clinicalAssessmentScore: 'ਸਕੋਰ',
    cognitiveAlerts: 'ਅਲਰਟ',
    emergencyContacts: 'ਐਮਰਜੈਂਸੀ ਨੰਬਰ',
    addFamilyMember: 'ਮੈਂਬਰ ਜੋੜੋ',
    activityAuditLog: 'ਲੌਗ',
  },
};

export const PAGE_GUIDANCE: Record<string, Record<LanguageCode, PageGuidanceContent>> = {
  login: {
    en: {
      title: 'Welcome to CogniCare Login',
      guidanceText: 'Welcome to CogniCare! You can log in using your registered email address and password. Or tap Patient Demo or Caregiver Demo for instant access.',
    },
    ta: {
      title: 'காக்னிகேர் உள்நுழைவு',
      guidanceText: 'வணக்கம்! காக்னிகேருக்கு உங்களை வரவேற்கிறோம். இங்கே உங்கள் மின்னஞ்சல் மற்றும் கடவுச்சொல்லைக் கொடுத்து உள்நுழையலாம். அல்லது நோயாளி அல்லது பராமரிப்பாளர் பொத்தானை அழுத்தி உடனடியாகத் தொடங்கலாம்.',
    },
    hi: {
      title: 'कॉग्निकेयर लॉगिन',
      guidanceText: 'नमस्ते! कॉग्निकेयर में आपका स्वागत है। आप अपना ईमेल और पासवर्ड डालकर लॉगिन कर सकते हैं। या फिर पेशेंट या केयरगिवर डेमो बटन दबाकर तुरंत शुरू कर सकते हैं।',
    },
    te: {
      title: 'కాగ్నికేర్ లాగిన్',
      guidanceText: 'నమస్కారం! కాగ్నికేర్‌కు స్వాగతం. మీ ఈమెయిల్ మరియు పాస్‌వర్డ్‌తో లాగిన్ అవ్వండి లేదా డెమో బటన్‌ను నొక్కండి.',
    },
    kn: {
      title: 'ಕಾಗ್ನಿಕೇರ್ ಲಾಗಿನ್',
      guidanceText: 'ನಮಸ್ಕಾರ! ಕಾಗ್ನಿಕೇರ್‌ಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಿ ಲಾಗಿನ್ ಮಾಡಿ ಅಥವಾ ಡೆಮೊ ಬಟನ್ ಒತ್ತಿ.',
    },
    ml: {
      title: 'കോഗ്നികെയർ ലോഗിൻ',
      guidanceText: 'നമസ്കാരം! കോഗ്നികെയറിലേക്ക് സ്വാഗതം. നിങ്ങളുടെ ഇമെയിലും പാസ്‌വേഡും നൽകി ലോഗിൻ ചെയ്യുക അല്ലെങ്കിൽ ഡെമോ ബട്ടൺ ഉപയോഗിക്കുക.',
    },
    bn: {
      title: 'কগনিকেয়ার লগইন',
      guidanceText: 'নমস্কার! কগনিকেয়ারে স্বাগতম। আপনার ইমেল ও পাসওয়ার্ড দিয়ে লগইন করুন অথবা ডেমো বাটন ব্যবহার করুন।',
    },
    mr: {
      title: 'कॉग्निकेअर लॉगिन',
      guidanceText: 'नमस्कार! कॉग्निकेअरमध्ये स्वागत आहे. ईमेल आणि पासवर्ड वापरून लॉगिन करा किंवा डेमो बटण दाबा.',
    },
    gu: {
      title: 'કોગ્નિબેર લોગિન',
      guidanceText: 'નમસ્તે! કોગ્નિબેર માં આપનું સ્વાગત છે. તમારો ઇમેઇલ અને પાસવર્ડ વાપરીને લોગિન કરો અથવા ડેમો બટન દબાવો.',
    },
    pa: {
      title: 'ਕੌਗਨੀਕੇਅਰ ਲੌਗਇਨ',
      guidanceText: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਕੌਗਨੀਕੇਅਰ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ। ਤੁਸੀਂ ਆਪਣੇ ਈਮੇਲ ਅਤੇ ਪਾਸਵਰਡ ਨਾਲ ਲੌਗਇਨ ਕਰ ਸਕਦੇ ਹੋ ਜਾਂ ਡੈਮੋ ਬਟਨ ਵਰਤ ਸਕਦੇ ਹੋ।',
    },
  },
  signup: {
    en: {
      title: 'Create Account',
      guidanceText: 'Fill in your name, email, and password, then select whether you are registering as a Patient or Caregiver.',
    },
    ta: {
      title: 'புதிய கணக்கு தொடங்குதல்',
      guidanceText: 'புதிய கணக்கை உருவாக்க, உங்கள் பெயர், மின்னஞ்சல் மற்றும் கடவுச்சொல்லைப் பதிவு செய்யுங்கள். பிறகு நீங்கள் நோயாளி கணக்கா அல்லது பராமரிப்பாளர் கணக்கா என்பதையும் தேர்ந்தெடுங்கள்.',
    },
    hi: {
      title: 'नया खाता बनाएं',
      guidanceText: 'नया अकाउंट बनाने के लिए अपना नाम, ईमेल और पासवर्ड भरें। फिर चुनें कि आप पेशेंट हैं या केयरगिवर।',
    },
    te: {
      title: 'కొత్త ఖాతా',
      guidanceText: 'మీ పేరు, ఈమెయిల్, పాస్‌వర్డ్ నమోదు చేసి పేషెంట్ లేదా కేర్‌గివర్‌గా నమోదు చేసుకోండి.',
    },
    kn: {
      title: 'ಹೊಸ ಖಾತೆ',
      guidanceText: 'ನಿಮ್ಮ ಹೆಸರು, ಇಮೇಲ್, ಪಾಸ್‌ವರ್ಡ್ ಭರ್ತಿ ಮಾಡಿ ಮತ್ತು ರೋಗಿ ಅಥವಾ ಪಾಲಕರಾಗಿ ನೋಂದಾಯಿಸಿ.',
    },
    ml: {
      title: 'പുതിയ അക്കൗണ്ട്',
      guidanceText: 'നിങ്ങളുടെ പേര്, ഇമെയിൽ, പാസ്‌വേഡ് എന്നിവ നൽകി രജിസ്റ്റർ ചെയ്യുക.',
    },
    bn: {
      title: 'নতুন অ্যাকাউন্ট',
      guidanceText: 'আপনার নাম, ইমেল, পাসওয়ার্ড দিন এবং রোগীর বা যত্নকারীর অ্যাকাউন্ট বাছুন।',
    },
    mr: {
      title: 'नवीन खाते',
      guidanceText: 'तुमचे नाव, ईमेल आणि पासवर्ड भरा आणि नोंदणी करा.',
    },
    gu: {
      title: 'નવું ખાતું',
      guidanceText: 'તમારું નામ, ઇમેઇલ, પાસવર્ડ ભરીને રજીસ્ટર કરો.',
    },
    pa: {
      title: 'ਨਵਾਂ ਖਾਤਾ',
      guidanceText: 'ਆਪਣਾ ਨਾਮ, ਈਮੇਲ, ਪਾਸਵਰਡ ਭਰੋ ਅਤੇ ਰਜਿਸਟਰ ਕਰੋ।',
    },
  },
  patient_dashboard: {
    en: {
      title: 'Patient Home Dashboard',
      guidanceText: 'Welcome to your home page! Here you can play cognitive memory games, recognize family members from photos, and track your daily progress.',
    },
    ta: {
      title: 'நோயாளி முகப்பு பக்கம்',
      guidanceText: 'வணக்கம்! இது உங்கள் முகப்புப் பக்கம். இங்கே நீங்கள் மனப்பயிற்சி விளையாட்டுகளை விளையாடலாம், குடும்பத்தினரின் படங்களைப் பார்க்கலாம், உங்கள் முன்னேற்றத்தையும் தெரிந்து கொள்ளலாம்.',
    },
    hi: {
      title: 'मरीज़ होम डैशबोर्ड',
      guidanceText: 'नमस्ते! यह आपका मुख्य पेज है। यहाँ आप माइंड गेम्स खेल सकते हैं, अपने परिवार की तस्वीरें देख सकते हैं और अपनी प्रगति देख सकते हैं।',
    },
    te: {
      title: 'పేషెంట్ హోమ్',
      guidanceText: 'నమస్కారం! ఇది మీ హోమ్ పేజీ. ఇక్కడ మీరు గేమ్‌లు ఆడవచ్చు మరియు మీ పురోగతిని చూడవచ్చు.',
    },
    kn: {
      title: 'ರೋಗಿಯ ಮುಖಪುಟ',
      guidanceText: 'ನಮಸ್ಕಾರ! ಇದು ನಿಮ್ಮ ಮುಖಪುಟ. ಇಲ್ಲಿ ನೀವು ಆಟಗಳನ್ನು ಆಡಬಹುದು ಮತ್ತು ಪ್ರಗತಿ ನೋಡಬಹುದು.',
    },
    ml: {
      title: 'രോഗിയുടെ ഹോം പേജ്',
      guidanceText: 'നമസ്കാരം! ഇത് നിങ്ങളുടെ ഹോം പേജാണ്. ഇവിടെ നിങ്ങൾക്ക് കളികൾ കളിക്കാനും പുരോഗതി കാണാനും കഴിയും.',
    },
    bn: {
      title: 'রোগীর হোম পেজ',
      guidanceText: 'নমস্কার! এটি আপনার হোম পেজ। এখান থেকে মাইন্ড গেম খেলতে পারেন এবং অগ্রগতির রিপোর্ট দেখতে পারেন।',
    },
    mr: {
      title: 'रुग्ण मुख्य पृष्ठ',
      guidanceText: 'नमस्कार! हे तुमचे मुख्य पेज आहे. येथून तुम्ही मेमरी गेम्स खेळू शकता व प्रगती पाहू शकता.',
    },
    gu: {
      title: 'દર્દી હોમ પેજ',
      guidanceText: 'નમસ્તે! આ તમારું હોમ પેજ છે. અહીંથી તમે માઇન્ડ ગેમ્સ રમી શકો છો અને પ્રોગ્રેસ જોઈ શકો છો.',
    },
    pa: {
      title: 'ਮਰੀਜ਼ ਹੋਮ ਪੇਜ',
      guidanceText: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਇਹ ਤੁਹਾਡਾ ਹੋਮ ਪੇਜ ਹੈ। ਇੱਥੋਂ ਤੁਸੀਂ ਖੇਡਾਂ ਖੇਡ ਸਕਦੇ ਹੋ ਅਤੇ ਤਰੱਕੀ ਵੇਖ ਸਕਦੇ ਹੋ।',
    },
  },
  memory_match: {
    en: {
      title: 'Memory Match Game',
      guidanceText: 'Memory Match Game! Flip the cards to find matching pairs like apples, cups, and flowers. Take your time and enjoy!',
    },
    ta: {
      title: 'நினைவாற்றல் பொருத்தும் விளையாட்டு',
      guidanceText: 'இது நினைவாற்றல் பொருத்தும் விளையாட்டு. அட்டைகளைத் திருப்பி ஆப்பிள், பூக்கள் போன்ற ஒரே மாதிரியான படங்களை சோடியாகப் பொருத்துங்கள். அவசரப்படாமல் மெதுவாக விளையாடுங்கள்.',
    },
    hi: {
      title: 'मेमोरी मैच खेल',
      guidanceText: 'यह मेमोरी मैच गेम है। कार्ड्स को पलटकर सेब और फूलों जैसी एक जैसी तस्वीरों के जोड़े मिलाएं। बिना किसी जल्दबाजी के आराम से खेलें।',
    },
    te: {
      title: 'మెమరీ మ్యాచ్ ఆట',
      guidanceText: 'కార్డులను తిప్పి ఒకేలా ఉన్న బొమ్మలను జత చేయండి. ప్రశాంతంగా ఆడండి!',
    },
    kn: {
      title: 'ಮೆಮೊರಿ ಮ್ಯಾಚ್ ಆಟ',
      guidanceText: 'ಕಾರ್ಡ್‌ಗಳನ್ನು ತಿರುಗಿಸಿ ಒಂದೇ ರೀತಿಯ ಚಿತ್ರಗಳನ್ನು ಜೋಡಿಸಿ. ನಿಧಾನವಾಗಿ ಆಡಿ!',
    },
    ml: {
      title: 'മെമ്മറി മാച്ച് ഗെയിം',
      guidanceText: 'കാർഡുകൾ മറിച്ചുനോക്കി ഒരേപോലെയുള്ള ചിത്രങ്ങൾ ജോടിയാക്കുക. ആസ്വദിച്ചു കളിക്കൂ!',
    },
    bn: {
      title: 'মেমোরি ম্যাচ খেলা',
      guidanceText: 'কার্ডগুলি উল্টে একরকমের ছবিগুলি মেলান। কোনো তাড়াহুড়ো নেই!',
    },
    mr: {
      title: 'मेमरी मॅच गेम',
      guidanceText: 'कार्ड उलटवून सारख्या चित्रांच्या जोड्या जुळवा. आरामात खेळा!',
    },
    gu: {
      title: 'મેમરી મેચ ગેમ',
      guidanceText: 'કાર્ડ ફેરવીને એકસરખા ચિત્રો જોડો. શાંતિથી રમો!',
    },
    pa: {
      title: 'ਮੈਮੋਰੀ ਮੈਚ ਖੇਡ',
      guidanceText: 'ਕਾਰਡ ਉਲਟਾ ਕੇ ਇੱਕੋ ਜਿਹੀਆਂ ਤਸਵੀਰਾਂ ਮਿਲਾਓ। ਆਰਾਮ ਨਾਲ ਖੇਡੋ!',
    },
  },
  pattern_recall: {
    en: {
      title: 'Pattern Recall Game',
      guidanceText: 'Pattern Recall Game! Watch the highlighted sequence of colors carefully, then tap the buttons in the exact same order.',
    },
    ta: {
      title: 'வண்ண வரிசை விளையாட்டு',
      guidanceText: 'இது வண்ண வரிசையை நினைவில் வைக்கும் விளையாட்டு. திரையில் ஒளிரும் வண்ணங்களின் வரிசையைக் கவனித்து, அதே வரிசையில் பொத்தான்களை அழுத்தவும்.',
    },
    hi: {
      title: 'पैटर्न याद रखने का खेल',
      guidanceText: 'यह पैटर्न याद रखने का गेम है। स्क्रीन पर रंगों के क्रम को ध्यान से देखें और उसी क्रम में बटन दबाएं।',
    },
    te: {
      title: 'ప్యాటర్న్ రికాల్ ఆట',
      guidanceText: 'రంగుల వరుసక్రమాన్ని జాగ్రత్తగా గమనించి, అదే వరుసలో బటన్లను నొక్కండి.',
    },
    kn: {
      title: 'ಪ್ಯಾಟರ್ನ್ ರಿಕಾಲ್ ಆಟ',
      guidanceText: 'ಬಣ್ಣಗಳ ಅನುಕ್ರಮವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಗಮನಿಸಿ, ನಂತರ ಅದೇ ಕ್ರಮದಲ್ಲಿ ಗುಂಡಿಗಳನ್ನು ಒತ್ತಿ.',
    },
    ml: {
      title: 'പാറ്റേൺ റീക്കോൾ ഗെയിം',
      guidanceText: 'നിറങ്ങളുടെ ക്രമം ശ്രദ്ധിച്ചു നോക്കുക, അതിനുശേഷം അതേ ക്രമത്തിൽ അമർത്തുക.',
    },
    bn: {
      title: 'প্যাটার্ন রিকল গেম',
      guidanceText: 'রঙের ক্রমটি সতর্কতার সাথে দেখুন এবং একই ক্রমে বোতামগুলি টিপুন।',
    },
    mr: {
      title: 'पॅटर्न रिकॉल गेम',
      guidanceText: 'रंगांचा क्रम लक्षपूर्वक पहा आणि त्याच क्रमाने बटणे दाबा.',
    },
    gu: {
      title: 'પેટર્ન રીકોલ ગેમ',
      guidanceText: 'રંગોનો ક્રમ ધ્યાનથી જુઓ અને તે જ ક્રમમાં બટન દબાવો.',
    },
    pa: {
      title: 'ਪੈਟਰਨ ਰੀਕਾਲ ਖੇਡ',
      guidanceText: 'ਰੰਗਾਂ ਦੇ ਕ੍ਰਮ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖੋ ਅਤੇ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਬਟਨ ਦਬਾਓ।',
    },
  },
  recognition_quiz: {
    en: {
      title: 'Object & Scene Recognition Quiz',
      guidanceText: 'Object Recognition Quiz! Look at the image or listen to the sound, then choose the correct answer or speak into your microphone.',
    },
    ta: {
      title: 'பொருட்கள் அடையாளம் காணும் விளையாட்டு',
      guidanceText: 'இது பொருட்கள் மற்றும் இடங்களை அடையாளம் காணும் விளையாட்டு. திரையில் உள்ள படத்தைப் பார்த்து அல்லது ஒலியைக் கேட்டு சரியான பதிலைத் தேர்ந்தெடுங்கள் அல்லது மைக் மூலம் பேசுங்கள்.',
    },
    hi: {
      title: 'वस्तु और दृश्य पहचान प्रश्नोत्तरी',
      guidanceText: 'यह वस्तुओं और दृश्यों को पहचानने का गेम है। फोटो देखें या आवाज सुनें, और सही जवाब चुनें या माइक से बोलें।',
    },
    te: {
      title: 'వస్తువుల గుర్తింపు క్విజ్',
      guidanceText: 'చిత్రాన్ని చూసి సరియైన సమాధానాన్ని ఎంచుకోండి లేదా మైక్‌లో చెప్పండి.',
    },
    kn: {
      title: 'ವಸ್ತು ಗುರುತಿಸುವಿಕೆ ರಸಪ್ರಶ್ನೆ',
      guidanceText: 'ಚಿತ್ರವನ್ನು ನೋಡಿ ಸರಿಯಾದ ಉತ್ತರವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಮೈಕ್ ಮೂಲಕ ಹೇಳಿ.',
    },
    ml: {
      title: 'വസ്തു തിരിച്ചറിയൽ ക്വിസ്',
      guidanceText: 'ചിത്രം കണ്ട് ശരിയായ ഉത്തരം തിരഞ്ഞെടുക്കുക അല്ലെങ്കിൽ മൈക്കിൽ പറയുക.',
    },
    bn: {
      title: 'বস্তু সনাক্তকরণ কুইজ',
      guidanceText: 'ছবিটি দেখুন এবং সঠিক উত্তরটি নির্বাচন করুন বা মাইকে বলুন।',
    },
    mr: {
      title: 'वस्तु ओळख क्विझ',
      guidanceText: 'चित्र पहा आणि योग्य उत्तर निवडा किंवा माईक वापरून बोला.',
    },
    gu: {
      title: 'વસ્તુ ઓળખ ક્વિઝ',
      guidanceText: 'ચિત્ર જુઓ અને સાચો જવાબ પસંદ કરો અથવા માઇક વડે બોલો.',
    },
    pa: {
      title: 'ਵਸਤੂ ਪਛਾਣ ਕਵਿਜ਼',
      guidanceText: 'ਤਸਵੀਰ ਵੇਖੋ ਅਤੇ ਸਹੀ ਉੱਤਰ ਚੁਣੋ ਜਾਂ ਮਾਈਕ ਨਾਲ ਬੋਲੋ।',
    },
  },
  family_recognition: {
    en: {
      title: 'Family & Relatives Recognition',
      guidanceText: 'Family Recognition game! Practice identifying your loved ones and their names from photos. Tap to listen to recorded voice hints!',
    },
    ta: {
      title: 'குடும்பத்தினரை அடையாளம் காணுதல்',
      guidanceText: 'இது உங்கள் குடும்பத்தினரை அடையாளம் காணும் விளையாட்டு. உங்கள் அன்பிற்குரியவர்களின் படங்கள் மற்றும் பெயர்களை நினைவு கூருங்கள். குரல் குறிப்புகளைக் கேட்க பொத்தானை அழுத்தலாம்.',
    },
    hi: {
      title: 'परिवार के सदस्यों की पहचान',
      guidanceText: 'यह परिवार के सदस्यों को पहचानने का गेम है। अपने प्रियजनों की फोटो और नाम पहचानें। आवाज में क्लू सुनने के लिए बटन दबाएं।',
    },
    te: {
      title: 'కుటుంబ సభ్యుల గుర్తింపు',
      guidanceText: 'మీ కుటుంబ సభ్యులను మరియు వారి పేర్లను గుర్తించడం ప్రాక్టీస్ చేయండి.',
    },
    kn: {
      title: 'ಕುಟುಂಬದವರ ಗುರುತಿಸುವಿಕೆ',
      guidanceText: 'ನಿಮ್ಮ ಪ್ರೀತಿಯ ಕುಟುಂಬ ಸದಸ್ಯರನ್ನು ಮತ್ತು ಅವರ ಹೆಸರುಗಳನ್ನು ಗುರುತಿಸಲು ಅಭ್ಯಾಸ ಮಾಡಿ.',
    },
    ml: {
      title: 'കുടുംബാംഗങ്ങളെ തിരിച്ചറിയൽ',
      guidanceText: 'നിങ്ങളുടെ പ്രിയപ്പെട്ട കുടുംബാംഗങ്ങളെയും അവരുടെ പേരുകളെയും തിരിച്ചറിയുക.',
    },
    bn: {
      title: 'পরিবারের স্বজনদের চেনা গেম',
      guidanceText: 'আপনার প্রিয়জনদের ছবি ও নাম চেনার অনুশীলন করুন।',
    },
    mr: {
      title: 'कुटुंबातील सदस्यांची ओळख',
      guidanceText: 'तुमच्या प्रियजनांना आणि त्यांच्या नावांना ओळखण्याचा सराव करा.',
    },
    gu: {
      title: 'પરિવારના સભ્યોની ઓળખ',
      guidanceText: 'તમારા સ્વજનો અને તેમના નામો ઓળખવાનો મહાવરો કરો.',
    },
    pa: {
      title: 'ਪਰਿਵਾਰ ਦੇ ਮੈਂਬਰਾਂ ਦੀ ਪਛਾਣ',
      guidanceText: 'ਆਪਣੇ ਪਿਆਰਿਆਂ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਨਾਮ ਪਛਾਣਨ ਦਾ ਅਭਿਆਸ ਕਰੋ।',
    },
  },
  patient_progress: {
    en: {
      title: 'My Progress & Achievements',
      guidanceText: 'Your Progress page! Review your completed exercises, scores, streaks, and unlocked achievement badges.',
    },
    ta: {
      title: 'எனது முன்னேற்றம்',
      guidanceText: 'இது உங்கள் முன்னேற்றப் பக்கம். நீங்கள் முடித்த பயிற்சிகள், பெற்ற மதிப்பெண்கள் மற்றும் சாதனைகளுக்கான பதக்கங்களை இங்கே பார்வையிடலாம்.',
    },
    hi: {
      title: 'मेरी प्रगति और उपलब्धियां',
      guidanceText: 'यह आपकी प्रगति रिपोर्ट है। आपके द्वारा खेले गए गेम्स, आपका स्कोर और मिले हुए बैज यहाँ देखें।',
    },
    te: {
      title: 'నా పురోగతి',
      guidanceText: 'మీరు పూర్తి చేసిన వ్యాయామాలు మరియు సాధించిన బ్యాడ్జ్‌లను చూడండి.',
    },
    kn: {
      title: 'ನನ್ನ ಪ್ರಗತಿ',
      guidanceText: 'ನೀವು ಪೂರ್ಣಗೊಳಿಸಿದ ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ಪಡೆದ ಬ್ಯಾಡ್ಜ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ.',
    },
    ml: {
      title: 'എന്റെ പുരോഗതി',
      guidanceText: 'നിങ്ങൾ പൂർത്തിയാക്കിയ കളികളും ലഭിച്ച ബാഡ്ജുകളും കാണുക.',
    },
    bn: {
      title: 'আমার অগ্রগতি',
      guidanceText: 'আপনার সম্পূর্ণ করা গেম এবং অর্জিত ব্যাজগুলি দেখুন।',
    },
    mr: {
      title: 'माझी प्रगती',
      guidanceText: 'तुम्ही पूर्ण केलेले उपक्रम आणि मिळालेले बॅजेस पहा.',
    },
    gu: {
      title: 'મારી પ્રોગ્રેસ',
      guidanceText: 'તમે પૂરી કરેલ એક્ટિવિટીઝ અને બેજ જુઓ.',
    },
    pa: {
      title: 'ਮੇਰੀ ਤਰੱਕੀ',
      guidanceText: 'ਆਪਣੀਆਂ ਖੇਡੀਆਂ ਖੇਡਾਂ ਅਤੇ ਮਿਲੇ ਬੈਜ ਵੇਖੋ।',
    },
  },
  patient_profile: {
    en: {
      title: 'Patient Profile & Settings',
      guidanceText: 'Your Profile & Settings page. Check your details, caregiver status, and toggle accessibility settings.',
    },
    ta: {
      title: 'நோயாளி சுயவிவரம்',
      guidanceText: 'இது உங்கள் சுயவிவரப் பக்கம். உங்கள் விவரங்கள், பராமரிப்பாளர் இணைப்பு மற்றும் திரையைத் தெளிவாகப் பார்க்க ஹை காண்ட்ராஸ்ட் வசதியை அமைத்துக் கொள்ளலாம்.',
    },
    hi: {
      title: 'मरीज़ प्रोफाइल',
      guidanceText: 'यह आपकी प्रोफाइल और सेटिंग्स का पेज है। अपनी जानकारी देखें और हाई कंट्रास्ट विकल्प चालू करें।',
    },
    te: {
      title: 'పేషెంట్ ప్రొఫైల్',
      guidanceText: 'మీ వివరాలు మరియు సెట్టింగ్‌లను ఇక్కడ పరిశీలించండి.',
    },
    kn: {
      title: 'ರೋಗಿಯ ಪ್ರೊಫೈಲ್',
      guidanceText: 'ನಿಮ್ಮ ವಿವರಗಳು ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ.',
    },
    ml: {
      title: 'രോഗിയുടെ പ്രൊഫൈൽ',
      guidanceText: 'നിങ്ങളുടെ വ്യക്തിഗത വിവരങ്ങളും ക്രമീകരണങ്ങളും കാണുക.',
    },
    bn: {
      title: 'রোগীর প্রোফাইল',
      guidanceText: 'আপনার ব্যক্তিগত তথ্য ও সেটিংস দেখুন।',
    },
    mr: {
      title: 'रुग्ण प्रोफाइल',
      guidanceText: 'तुमची वैयक्तिक माहिती व सेटिंग्ज पहा.',
    },
    gu: {
      title: 'દર્દી પ્રોફાઇલ',
      guidanceText: 'તમારી અંગત વિગતો અને સેટિંગ્સ જુઓ.',
    },
    pa: {
      title: 'ਮਰੀਜ਼ ਪ੍ਰੋਫਾਈਲ',
      guidanceText: 'ਆਪਣੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਅਤੇ ਸੈਟਿੰਗਾਂ ਵੇਖੋ।',
    },
  },
  caregiver_dashboard: {
    en: {
      title: 'Caregiver Clinical Hub',
      guidanceText: 'Caregiver Clinical Hub! Monitor patient clinical scores, memory trend alerts, emergency contact numbers, and daily activities.',
    },
    ta: {
      title: 'பராமரிப்பாளர் மையம்',
      guidanceText: 'பராமரிப்பாளர் மையத்திற்கு வரவேற்கிறோம். நோயாளியின் அறிவாற்றல் மதிப்பெண், எச்சரிக்கைகள், அவசரக்கால தொடர்புகள் மற்றும் தினசரி அட்டவணையை இங்கே கண்காணிக்கலாம்.',
    },
    hi: {
      title: 'केयरगिवर क्लिनिकल हब',
      guidanceText: 'केयरगिवर हब में आपका स्वागत है। यहाँ मरीज का कॉग्निटिव स्कोर, अलर्ट्स, इमरजेंसी नंबर और एक्टिविटी शेड्यूल देखें।',
    },
    te: {
      title: 'సంరక్షకుల కేంద్రం',
      guidanceText: 'పేషెంట్ మానసిక ఆరోగ్యం, అలర్ట్‌లు మరియు ఎమర్జెన్సీ వివరాలను పర్యవేక్షించండి.',
    },
    kn: {
      title: 'ಪಾಲಕರ ಕೇಂದ್ರ',
      guidanceText: 'ರೋಗಿಯ ಜ್ಞಾಪಕ ಶಕ್ತಿಯ ಪ್ರಗತಿ ಮತ್ತು ತುರ್ತು ಸಂಪರ್ಕಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    },
    ml: {
      title: 'പരിപാലക കേന്ദ്രം',
      guidanceText: 'രോഗിയുടെ ആരോഗ്യനിലയും അറിയിപ്പുകളും നിരീക്ഷിക്കുക.',
    },
    bn: {
      title: 'কেয়ারগিভার ড্যাশবোর্ড',
      guidanceText: 'রোগীর মানসিক স্বাস্থ্য ও অ্যালার্টসমূহ পর্যবেক্ষণ করুন।',
    },
    mr: {
      title: 'केअरगिव्हर हब',
      guidanceText: 'रुग्णाची प्रगती आणि अलर्ट्स तपासा.',
    },
    gu: {
      title: 'કેરગીવર ડેશબોર્ડ',
      guidanceText: 'દર્દીનું માનસિક સ્વાસ્થ્ય અને એલેર્ટ્સ મોનિટર કરો.',
    },
    pa: {
      title: 'ਕੇਅਰਗਿਵਰ ਹਬ',
      guidanceText: 'ਮਰੀਜ਼ ਦੀ ਦਿਮਾਗੀ ਸਿਹਤ ਅਤੇ ਅਲਰਟ ਵੇਖੋ।',
    },
  },
  caregiver_progress: {
    en: {
      title: 'Patient Analytics',
      guidanceText: 'Patient Analytics page! Deep dive into memory retention, spatial awareness, and reaction speed charts.',
    },
    ta: {
      title: 'நோயாளி பகுப்பாய்வு',
      guidanceText: 'நோயாளி பகுப்பாய்வுப் பக்கம். நோயாளியின் நினைவாற்றல், வேகத்திறன் மற்றும் செயல்படும் திறன் பற்றிய விளக்கப்படங்களை ஆராயுங்கள்.',
    },
    hi: {
      title: 'मरीज़ विश्लेषण',
      guidanceText: 'मरीज़ विश्लेषण पेज। मरीज की याददाश्त, ध्यान और रिस्पॉन्स टाइम के चार्ट्स देखें।',
    },
    te: {
      title: 'పేషెంట్ విశ్లేషణ',
      guidanceText: 'పేషెంట్ మెమరీ మరియు ప్రతిస్పందన సమయాల వివరాలు చూడండి.',
    },
    kn: {
      title: 'ರೋಗಿಯ ವಿಶ್ಲೇಷಣೆ',
      guidanceText: 'ರೋಗಿಯ ಜ್ಞಾಪಕ ಶಕ್ತಿ ಮತ್ತು ವೇಗದ ವರದಿಗಳನ್ನು ನೋಡಿ.',
    },
    ml: {
      title: 'രോഗി വിശകലനം',
      guidanceText: 'രോഗിയുടെ മെമ്മറി ഗ്രാഫുകളും വശങ്ങളും പരിശോധിക്കുക.',
    },
    bn: {
      title: 'রোগীর রিপোর্ট',
      guidanceText: 'স্মৃতিশক্তি ও প্রতিক্রিয়া সময়ের বিস্তারিত গ্রাফ দেখুন।',
    },
    mr: {
      title: 'रुग्ण विश्लेषण',
      guidanceText: 'स्मरणशक्ती आणि प्रतिक्रिया वेळेचा आलेख पहा.',
    },
    gu: {
      title: 'દર્દી એનાલિટિક્સ',
      guidanceText: 'યાદશક્તિ અને સ્પીડના ચાર્ટ જુઓ.',
    },
    pa: {
      title: 'ਮਰੀਜ਼ ਵਿਸ਼ਲੇਸ਼ਣ',
      guidanceText: 'ਯਾਦਦਾਸ਼ਤ ਅਤੇ ਪ੍ਰਤੀਕਿਰਿਆ ਸਮੇਂ ਦੇ ਚਾਰਟ ਵੇਖੋ।',
    },
  },
  family_members: {
    en: {
      title: 'Family Members Manager',
      guidanceText: 'Family Members Manager! Add family member photos, relationships, and record personalized voice hints.',
    },
    ta: {
      title: 'குடும்ப உறுப்பினர்கள் மேலாண்மை',
      guidanceText: 'குடும்ப உறுப்பினர்கள் மேலாண்மைப் பக்கம். புதிய குடும்ப உறுப்பினர்களின் படங்களைச் சேர்க்கலாம், உறவுமுறைகளைக் குறிப்பிடலாம், மற்றும் அவர்களின் குரல் குறிப்புகளைப் பதிவு செய்யலாம்.',
    },
    hi: {
      title: 'परिवार के सदस्य प्रबंधक',
      guidanceText: 'फैमिली मेंबर्स मैनेजर। नए सदस्यों की फोटो जोड़ें, रिश्ते दर्ज करें और उनके लिए वॉयस नोट्स रिकॉर्ड करें।',
    },
    te: {
      title: 'కుటుంబ సభ్యుల నిర్వహణ',
      guidanceText: 'కుటుంబ సభ్యుల ఫోటోలు మరియు వివరాలను ఇక్కడ చేర్చండి.',
    },
    kn: {
      title: 'ಕುಟುಂಬದವರ ನಿರ್ವಹಣೆ',
      guidanceText: 'ಕುಟುಂಬದವರ ಫೋಟೋಗಳು ಮತ್ತು ವಿವರಗಳನ್ನು ಸೇರಿಸಿ.',
    },
    ml: {
      title: 'കുടുംബാംഗങ്ങളുടെ മാനേജ്‌മെന്റ്',
      guidanceText: 'കുടുംബാംഗങ്ങളുടെ ചിത്രങ്ങളും ശബ്ദക്കുറിപ്പുകളും ചേർക്കുക.',
    },
    bn: {
      title: 'পরিবারের সদস্য সংযোগ',
      guidanceText: 'পরিবারের সদস্যদের ছবি ও ভয়েস নোট যোগ করুন।',
    },
    mr: {
      title: 'कुटुंब सदस्य व्यवस्थापक',
      guidanceText: 'नातेवाईकांचे फोटो व व्हॉइस नोट्स जोडा.',
    },
    gu: {
      title: 'પરિવાર સભ્યો મેનેજર',
      guidanceText: 'પરિવારના સભ્યોના ફોટા અને વિગતો ઉમેરો.',
    },
    pa: {
      title: 'ਪਰਿਵਾਰਕ ਮੈਂਬਰ ਪ੍ਰਬੰਧਕ',
      guidanceText: 'ਪਰਿਵਾਰ ਦੇ ਮੈਂਬਰਾਂ ਦੀਆਂ ਫੋਟੋਆਂ ਅਤੇ ਵੇਰਵੇ ਜੋੜੋ।',
    },
  },
  activity_log: {
    en: {
      title: 'Clinical Activity Logs',
      guidanceText: 'Activity Logs page! Review chronological timestamps of games played, scores, and patient activity logs.',
    },
    ta: {
      title: 'செயல்பாட்டுப் பதிவுகள்',
      guidanceText: 'செயல்பாட்டுப் பதிவுப் பக்கம். நோயாளி விளையாடிய விளையாட்டுகள், நேரப் பதிவுகள் மற்றும் மதிப்பெண்களின் அறிக்கையைப் பாருங்கள்.',
    },
    hi: {
      title: 'क्लिनिकल गतिविधि लॉग',
      guidanceText: 'एक्टिविटी लॉग पेज। मरीज के गेम खेलने के समय और स्कोर का रिकॉर्ड देखें।',
    },
    te: {
      title: 'యాక్టివిటీ లాగ్స్',
      guidanceText: 'గేమ్ పూర్తయిన సమయాలు మరియు స్కోర్‌ల చిట్టాను చూడండి.',
    },
    kn: {
      title: 'ಆಕ್ಟಿವಿಟಿ ಲಾಗ್‌ಗಳು',
      guidanceText: 'ಆಟ ಪೂರ್ಣಗೊಂಡ ಸಮಯಗಳು ಮತ್ತು ಅಂಕಗಳ ಪಟ್ಟಿಯನ್ನು ನೋಡಿ.',
    },
    ml: {
      title: 'പ്രവർത്തന ലോഗുകൾ',
      guidanceText: 'ഗെയിം പൂർത്തിയാക്കിയ സമയ വിവരങ്ങൾ കാണുക.',
    },
    bn: {
      title: 'অ্যাক্টিভিটি লগ',
      guidanceText: 'গেম খেলার সময় ও স্কোর দেখতে লগ পরীক্ষা করুন।',
    },
    mr: {
      title: 'अ‍ॅक्टिव्हिटी लॉग्स',
      guidanceText: 'खेळ पूर्ण केल्याच्या वेळा व स्कोअर पहा.',
    },
    gu: {
      title: 'એક્ટિવિટી લોગ',
      guidanceText: 'રમેલ ગેમ્સનો સમય અને સ્કોર લોગ જુઓ.',
    },
    pa: {
      title: 'ਗਤੀਵਿਧੀ ਲੌਗ',
      guidanceText: 'ਖੇਡਾਂ ਖੇਡਣ ਦਾ ਸਮਾਂ ਅਤੇ ਸਕੋਰ ਲੌਗ ਵੇਖੋ।',
    },
  },
  caregiver_profile: {
    en: {
      title: 'Caregiver Account & Linked Patients',
      guidanceText: 'Caregiver Profile page! Manage account preferences and switch or link patient profiles.',
    },
    ta: {
      title: 'பராமரிப்பாளர் சுயவிவரம்',
      guidanceText: 'பராமரிப்பாளர் சுயவிவரப் பக்கம். உங்கள் கணக்கு அமைப்புகளை மேலாண்மை செய்யவும், நோயாளியின் சுயவிவரத்தை இணைக்கவும்.',
    },
    hi: {
      title: 'केयरगिवर प्रोफ़ाइल',
      guidanceText: 'केयरगिवर प्रोफाइल। अपना अकाउंट मैनेज करें और पेशेंट प्रोफाइल लिंक करें।',
    },
    te: {
      title: 'కేర్‌గివర్ ప్రొఫైల్',
      guidanceText: 'మీ ఖాతా వివరాలు మరియు అనుసంధానించబడిన పేషెంట్ వివరాలు చూడండి.',
    },
    kn: {
      title: 'ಪಾಲಕರ ಪ್ರೊಫೈಲ್',
      guidanceText: 'ನಿಮ್ಮ ಖಾತೆ ಮತ್ತು ಜೋಡಿಸಲಾದ ರೋಗಿಯ ವಿವರಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',
    },
    ml: {
      title: 'പരിപാലക പ്രൊഫൈൽ',
      guidanceText: 'അക്കൗണ്ട് ക്രമീകരണങ്ങളും ബന്ധിപ്പിച്ച രോഗിയുടെ വിവരങ്ങളും കൈകാര്യം ചെയ്യുക.',
    },
    bn: {
      title: 'কেয়ারগিভার প্রোফাইল',
      guidanceText: 'আপনার অ্যাকাউন্ট ও সংযুক্ত রোগীর বিবরণ পরিচালন করুন।',
    },
    mr: {
      title: 'केअरगिव्हर प्रोफाइल',
      guidanceText: 'तुमचे खाते आणि जोडलेल्या रुग्णाची माहिती व्यवस्थापित करा.',
    },
    gu: {
      title: 'કેરગીવર પ્રોફાઇલ',
      guidanceText: 'તમારું એકાઉન્ટ અને લિંક થયેલ દર્દી વિગતો મેનેજ કરો.',
    },
    pa: {
      title: 'ਕੇਅਰਗਿਵਰ ਪ੍ਰੋਫਾਈਲ',
      guidanceText: 'ਆਪਣਾ ਖਾਤਾ ਅਤੇ ਜੁੜੇ ਮਰੀਜ਼ ਦੇ ਵੇਰਵੇ ਸੰਭਾਲੋ।',
    },
  },
};

export const ROUTE_GUIDANCE_MAP: Record<string, string> = {
  '/login': 'login',
  '/signup': 'signup',
  '/patient/dashboard': 'patient_dashboard',
  '/patient/games': 'patient_dashboard',
  '/patient/memory-match': 'memory_match',
  '/patient/pattern-recall': 'pattern_recall',
  '/patient/recognition-quiz': 'recognition_quiz',
  '/patient/family-recognition': 'family_recognition',
  '/patient/progress': 'patient_progress',
  '/patient/profile': 'patient_profile',
  '/caregiver/dashboard': 'caregiver_dashboard',
  '/caregiver/progress': 'caregiver_progress',
  '/caregiver/family-members': 'family_members',
  '/caregiver/activity': 'activity_log',
  '/caregiver/profile': 'caregiver_profile',
};

export interface NavigationCommand {
  keywords: string[];
  route: string;
}

export const GLOBAL_NAVIGATION_COMMANDS: NavigationCommand[] = [
  {
    keywords: [
      'home', 'dashboard', 'main dashboard', 'patient home', 'go home',
      'முகப்பு', 'ஹோம்',
      'होम', 'मुख्य', 'डैशबोर्ड', 'गृह',
      'హోమ్', 'ಮುಖಪುಟ', 'ഹോം', 'হোম', 'ઘર'
    ],
    route: '/patient/dashboard',
  },
  {
    keywords: [
      'games', 'activities', 'exercise', 'play',
      'விளையாட்டு', 'விளையாட்டுகள்', 'பயிற்சி',
      'खेल', 'गेम्स', 'गतिविधियां',
      'ఆటలు', 'ಆಟಗಳು', 'കളികൾ', 'খেলা', 'રમતો', 'ਖੇਡਾਂ'
    ],
    route: '/patient/games',
  },
  {
    keywords: [
      'memory match', 'memory', 'cards',
      'நினைவாற்றல்', 'கார்டு',
      'मेमोरी मैच', 'ताश', 'कार्ड',
      'మెమరీ'
    ],
    route: '/patient/memory-match',
  },
  {
    keywords: [
      'pattern', 'recall', 'sequence',
      'வரிசை', 'வண்ணம்',
      'पैटर्न', 'क्रम',
      'ప్యాటర్న్'
    ],
    route: '/patient/pattern-recall',
  },
  {
    keywords: [
      'quiz', 'object', 'scene',
      'பொருட்கள்', 'வினாடி வினா',
      'क्विज', 'वस्तु', 'पहचान',
      'క్విజ్'
    ],
    route: '/patient/recognition-quiz',
  },
  {
    keywords: [
      'family', 'relatives', 'photos',
      'குடும்பம்', 'உறவினர்கள்', 'புகைப்படம்',
      'परिवार', 'रिश्तेदार', 'फोटो',
      'కుటుంబం', 'ಕುಟುಂಬ', 'കുടുംബം', 'পরিবার', 'પરિવાર', 'ਪਰਿਵਾਰ'
    ],
    route: '/patient/family-recognition',
  },
  {
    keywords: [
      'progress', 'score', 'badges', 'streak',
      'முன்னேற்றம்', 'மதிப்பெண்', 'பதக்கம்',
      'प्रगति', 'स्कोर', 'बैज',
      'పురోగతి', 'ಪ್ರಗತಿ', 'പുരോഗതി', 'অগ্রগতি', 'પ્રગતિ', 'ਤਰੱਕੀ'
    ],
    route: '/patient/progress',
  },
  {
    keywords: [
      'profile', 'account', 'settings',
      'சுயவிவரம்', 'கணக்கு',
      'प्रोफाइल', 'खाता',
      'ప్రொఫైల్', 'ಪ್ರೊಫೈಲ್', 'ಪ್ರൊഫൈൽ', 'প্রোফাইল', 'પ્રોફાઇલ', 'ਪ੍ਰੋਫਾਈਲ'
    ],
    route: '/patient/profile',
  },
  {
    keywords: [
      'caregiver', 'doctor', 'hub',
      'பராமரிப்பாளர்', 'டாக்டர்',
      'केयरगिवर', 'डॉक्टर',
      'సంరక్షకుడు', '<ctrl42>పాలకరు'
    ],
    route: '/caregiver/dashboard',
  },
  {
    keywords: ['family members', 'family manager', 'manage family', 'caregiver family', 'குடும்ப உறுப்பினர்கள்', 'உறுப்பினர்கள்'],
    route: '/caregiver/family-members',
  },
  {
    keywords: ['activity log', 'logs', 'audit log', 'activity audit', 'செயல்பாட்டுப் பதிவுகள்', 'பதிவுகள்'],
    route: '/caregiver/activity',
  },
  {
    keywords: ['analytics', 'patient analytics', 'patient progress', 'caregiver analytics', 'நோயாளி பகுப்பாய்வு', 'பகுப்பாய்வு'],
    route: '/caregiver/progress',
  },
  {
    keywords: ['login', 'sign in', 'உள்நுழை', 'லாகின்'],
    route: '/login',
  },
  {
    keywords: ['signup', 'sign up', 'register', 'create account', 'பதிவு'],
    route: '/signup',
  },
];
