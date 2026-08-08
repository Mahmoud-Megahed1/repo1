import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const SocialIcons = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/@Englishom_sa",
    bg: "bg-[#FF0000]",
    svg: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/Englishom_sa",
    bg: "bg-[#0f1419] border border-slate-700",
    svg: (
      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@englishom_sa",
    bg: "bg-[#111111] border border-slate-800",
    svg: (
      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.39.67-4.8 2.37-6.49 1.69-1.69 4.13-2.52 6.51-2.22v4.14c-1.16-.16-2.37.15-3.23.86-.88.7-1.38 1.78-1.35 2.9.01 1.05.51 2.05 1.34 2.7.83.66 1.94.94 2.99.76 1.05-.16 2.02-.79 2.56-1.7.53-.89.77-1.95.74-2.99V.02z"/>
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/966542577250",
    bg: "bg-[#25D366]",
    svg: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/Englishom_sa",
    bg: "bg-[#229ED9]",
    svg: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.03 9.56c-.15.68-.55.84-1.12.52l-3.1-2.28-1.49 1.44c-.17.17-.31.31-.63.31l.22-3.16 5.76-5.2c.25-.22-.05-.35-.39-.13l-7.12 4.48-3.07-.96c-.67-.21-.68-.67.14-.99l12.01-4.63c.56-.21 1.05.13.83.99z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/englishom_sa?igsh=cTB6czYwYXR2Zmty",
    bg: "bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600",
    svg: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: "Snapchat",
    href: "https://www.snapchat.com/add/englishom_sa",
    bg: "bg-[#FFFA37] border border-[#e5e01b]",
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M21.026 8.186C20.06 6.969 18.466 6 16.012 6c-2.103.02-6.308 1.184-6.308 5.674 0 .655.052 1.534.097 2.18a1.589 1.589 0 01-.223-.094l-.015-.007c-.184-.089-.464-.223-.853-.223-.394 0-.774.154-1.056.382-.28.227-.52.576-.52.998 0 .528.296.879.644 1.104.308.2.697.327 1.005.428l.03.01c.33.108.572.19.739.294.13.08.149.132.151.18a1.753 1.753 0 01-.105.248 5.967 5.967 0 01-.36.597c-.303.445-.67.902-.946 1.167a6.09 6.09 0 01-1.182.843c-.23.128-.456.234-.658.307a1.464 1.464 0 01-.456.104.696.696 0 00-.168.022 1.326 1.326 0 00-.393.178c-.181.123-.435.37-.435.758 0 .203.048.375.13.524.072.13.165.23.218.287l.008.008.015.016c.293.316.78.535 1.25.686.406.13.859.226 1.3.284l.02.093.002.01c.028.132.065.305.12.465.05.151.143.375.333.534.241.202.557.223.763.222.221 0 .48-.032.725-.062l.02-.002a8.944 8.944 0 011.08-.085c.682 0 1.12.285 1.805.754l.005.003c.238.162.504.344.806.523 1.012.598 1.835.593 2.3.59a13.491 13.491 0 01.176 0c.467.003 1.311.008 2.324-.59.302-.18.568-.36.806-.523l.005-.003c.686-.469 1.123-.754 1.805-.754.373 0 .734.043 1.08.085l.02.002c.245.03.503.061.725.062.206 0 .522-.02.763-.222.19-.16.283-.383.334-.534.054-.16.09-.333.119-.464l.002-.011.02-.093a7.607 7.607 0 001.3-.284c.47-.15.957-.37 1.25-.686l.015-.016.008-.008c.053-.057.146-.156.218-.287.082-.149.13-.32.13-.524 0-.389-.254-.635-.436-.758a1.327 1.327 0 00-.392-.178.696.696 0 00-.168-.022c-.095 0-.247-.029-.456-.104a4.664 4.664 0 01-.658-.307 6.091 6.091 0 01-1.182-.843c-.275-.265-.643-.722-.945-1.167a5.955 5.955 0 01-.362-.597 1.762 1.762 0 01-.104-.248c.002-.048.022-.1.151-.18.167-.104.409-.186.738-.295l.03-.01c.309-.1.698-.228 1.006-.427.348-.225.645-.576.645-1.103 0-.422-.24-.772-.52-.999a1.711 1.711 0 00-1.057-.382c-.39 0-.67.134-.853.223l-.015.007c-.104.05-.17.079-.223.094.045-.646.097-1.525.097-2.18 0-.89-.323-2.295-1.27-3.488zm-9.243.587c-.8 1.002-1.075 2.193-1.075 2.9 0 .657.055 1.568.102 2.222a.865.865 0 01-.218.67c-.192.204-.453.27-.686.27-.337 0-.593-.123-.757-.202l-.019-.009c-.183-.088-.279-.128-.42-.128a.687.687 0 00-.41.155c-.126.103-.163.202-.163.26 0 .116.043.2.2.301.187.12.453.211.8.325l.031.01c.29.095.647.212.93.388.317.198.61.516.61 1.005 0 .128-.036.252-.07.345a2.663 2.663 0 01-.139.316c-.11.214-.258.456-.42.697-.324.477-.735.994-1.077 1.323-.345.332-.865.705-1.39.997-.265.147-.541.278-.808.374a2.568 2.568 0 01-.742.164.392.392 0 00-.051.028l-.005.003a.14.14 0 00.003.015.075.075 0 00.008.019c.01.017.024.037.086.103l.016.017c.111.12.385.275.82.414.412.132.901.227 1.363.271a.586.586 0 01.42.244c.059.08.092.165.111.22.038.11.066.243.088.349l.004.016c.03.143.057.267.092.37a.753.753 0 00.033.083.877.877 0 00.105.005c.212 0 .425-.032.635-.058.337-.04.753-.09 1.194-.09 1.023 0 1.698.46 2.35.906l.037.025c.24.165.483.33.755.49.766.453 1.349.45 1.775.448h.174c.43.002 1.034.005 1.8-.447.271-.161.513-.326.754-.49l.037-.026c.652-.445 1.327-.906 2.35-.906.44 0 .857.05 1.194.09l.01.002c.272.032.471.056.625.056a.876.876 0 00.105-.005.764.764 0 00.033-.084c.035-.102.062-.226.092-.37l.004-.015c.022-.106.05-.24.088-.348a.846.846 0 01.11-.22.586.586 0 01.421-.245c.462-.044.95-.14 1.364-.271.434-.139.708-.294.819-.414l.016-.017a.604.604 0 00.087-.103.075.075 0 00.008-.019.13.13 0 00.003-.015l-.005-.003a.294.294 0 00-.051-.028 2.568 2.568 0 01-.742-.164 5.676 5.676 0 01-.808-.374c-.525-.292-1.045-.665-1.39-.997-.342-.33-.753-.846-1.076-1.323a6.893 6.893 0 01-.421-.697 2.663 2.663 0 01-.14-.316 1.051 1.051 0 01-.069-.345c0-.49.293-.807.61-1.005.283-.176.64-.293.93-.388l.03-.01c.348-.114.614-.204.8-.325.158-.102.2-.185.2-.301 0-.058-.036-.157-.162-.26a.687.687 0 00-.41-.155c-.141 0-.237.04-.42.128l-.019.01c-.164.078-.42.201-.757.201-.233 0-.494-.066-.686-.27a.865.865 0 01-.218-.67c.047-.654.102-1.565.102-2.221 0-.71-.27-1.9-1.065-2.903-.776-.978-2.075-1.805-4.215-1.805-2.14 0-3.446.827-4.229 1.807z" fill="#000"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M11.783 8.773c-.801 1.003-1.076 2.193-1.076 2.9 0 .657.056 1.568.103 2.222a.866.866 0 01-.219.67c-.191.204-.452.27-.686.27-.336 0-.593-.123-.756-.202l-.02-.009c-.182-.088-.278-.128-.42-.128a.687.687 0 00-.41.155c-.125.103-.162.203-.162.26 0 .116.043.2.2.301.187.12.452.211.8.325l.03.01c.29.095.648.212.93.388.317.198.61.516.61 1.005 0 .128-.035.252-.068.345a2.68 2.68 0 01-.14.316c-.11.214-.258.456-.421.697-.323.477-.735.994-1.076 1.323-.346.332-.865.705-1.39.997-.265.147-.542.278-.808.374a2.562 2.562 0 01-.742.164.326.326 0 00-.051.028l-.005.003c0 .007.002.012.003.015a.075.075 0 00.007.019c.01.017.025.037.087.103l.016.017c.111.12.385.275.819.414.413.132.902.227 1.364.271a.586.586 0 01.42.244c.058.08.091.165.11.22.038.11.067.243.089.349l.003.016c.03.144.058.267.092.37a.76.76 0 00.034.084.905.905 0 00.105.004c.212 0 .425-.032.635-.057.337-.041.753-.091 1.194-.091 1.023 0 1.698.46 2.35.906l.036.025c.242.165.483.33.755.49.766.454 1.35.45 1.775.448a13.148 13.148 0 01.175 0c.43.002 1.033.005 1.8-.447.271-.161.513-.326.754-.49l.037-.026c.652-.445 1.327-.906 2.35-.906.44 0 .857.05 1.194.09l.01.002c.272.032.471.056.625.056a.904.904 0 00.105-.004.755.755 0 00.033-.085c.035-.102.061-.225.092-.37l.003-.015c.023-.106.051-.24.088-.348a.847.847 0 01.111-.22.586.586 0 01.42-.245c.463-.044.951-.14 1.364-.271.434-.139.708-.294.82-.414l.016-.017a.604.604 0 00.086-.103.075.075 0 00.008-.019l.003-.015-.005-.003a.294.294 0 00-.052-.028 2.562 2.562 0 01-.742-.164 5.654 5.654 0 01-.807-.374c-.525-.292-1.045-.665-1.39-.997-.342-.33-.753-.846-1.077-1.323a6.913 6.913 0 01-.42-.697 2.696 2.696 0 01-.14-.316 1.054 1.054 0 01-.069-.345c0-.49.293-.807.61-1.005.283-.176.64-.293.93-.388l.03-.01c.348-.114.613-.204.8-.325.158-.102.2-.185.2-.301 0-.057-.036-.157-.162-.26a.687.687 0 00-.41-.155c-.141 0-.238.04-.42.128l-.02.01c-.163.078-.42.201-.756.201-.233 0-.494-.066-.686-.27a.865.865 0 01-.219-.67 35.1 35.1 0 00.103-2.221c0-.71-.27-1.9-1.065-2.902-.776-.98-2.075-1.806-4.216-1.806-2.14 0-3.445.827-4.228 1.807z" fill="#fff" />
      </svg>
    ),
  },
  {
    name: "Blog",
    href: "https://englishom.com/blog",
    bg: "bg-[#800000] border border-[#600000]",
    svg: (
      <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
        <rect x="1.5" y="1.5" width="29" height="29" rx="5.5" fill="#7A1A1A" stroke="#C9A94E" strokeWidth="1.5"/>
        <path d="M16 5L25 11.5V23H7V11.5L16 5Z" stroke="#C9A94E" strokeWidth="0.9" fill="none"/>
        <path d="M16 7.5L18 14.5H14L16 7.5Z" fill="#C9A94E"/>
        <path d="M14.5 14.5H17.5V16.2C17.5 16.6 17.2 16.8 16.8 16.8H15.2C14.8 16.8 14.5 16.6 14.5 16.2V14.5Z" fill="#C9A94E"/>
        <circle cx="16" cy="13.5" r="0.6" fill="#7A1A1A"/>
        <rect x="17.2" y="8.5" width="1.6" height="1.6" rx="0.2" stroke="#C9A94E" strokeWidth="0.5" fill="none"/>
        <line x1="17.2" y1="9.3" x2="18.8" y2="9.3" stroke="#C9A94E" strokeWidth="0.3"/>
        <line x1="18" y1="8.5" x2="18" y2="10.1" stroke="#C9A94E" strokeWidth="0.3"/>
        <path d="M7.5 20C10 18.5 13 18.3 16 20.5C19 18.3 22 18.5 24.5 20V24C22 22.5 19 22.3 16 24.5C13 22.3 10 22.5 7.5 24V20Z" fill="#C9A94E"/>
        <path d="M16 20.5V24.5" stroke="#7A1A1A" strokeWidth="0.4"/>
        <path d="M8.5 19.5C10.5 18.2 13 18 15.5 19.8" stroke="#C9A94E" strokeWidth="0.35" fill="none"/>
        <path d="M9 19C11 17.8 13.5 17.7 15 19.2" stroke="#C9A94E" strokeWidth="0.25" fill="none"/>
        <path d="M23.5 19.5C21.5 18.2 19 18 16.5 19.8" stroke="#C9A94E" strokeWidth="0.35" fill="none"/>
        <path d="M23 19C21 17.8 18.5 17.7 17 19.2" stroke="#C9A94E" strokeWidth="0.25" fill="none"/>
      </svg>
    ),
  },
  {
    name: "Threads",
    href: "https://www.threads.net/@englishom_sa",
    bg: "bg-[#000000] border border-slate-700",
    svg: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M12.016 1.832c-5.59 0-10.133 4.542-10.133 10.132 0 5.59 4.543 10.134 10.133 10.134 5.59 0 10.133-4.543 10.133-10.134.001-5.59-4.543-10.132-10.133-10.132zm4.186 11.233c-.279.585-.644.896-.867 1.056-.479.341-1.077.51-1.782.51-.715 0-1.332-.191-1.831-.568-.31-.235-.558-.553-.746-.94-.092-.19-.17-.387-.234-.587-.197.643-.456 1.2-.767 1.644a4.43 4.43 0 0 1-1.611 1.401c-.559.294-1.218.441-1.954.441-.837 0-1.536-.188-2.083-.561A3.19 3.19 0 0 1 5.3 12.3c0-.853.256-1.533.766-2.023.51-.49 1.205-.738 2.069-.738.31 0 .614.032.909.096.295.064.557.164.782.298v-.435c0-.629.176-1.127.525-1.48.349-.354.831-.531 1.432-.531.601 0 1.082.177 1.431.531.35.353.526.851.526 1.48v1.385c.16.516.383.901.666 1.15.283.25.633.376 1.045.376.413 0 .762-.126 1.045-.376.284-.249.507-.634.667-1.15v-1.385c0-1.983-.629-3.527-1.88-4.59-1.251-1.063-2.986-1.6-5.161-1.6C7.5 5.232 5.617 5.86 4.352 7.098c-1.265 1.238-1.905 2.92-1.905 4.992v.223c0 2.072.64 3.754 1.905 4.992 1.265 1.238 3.148 1.866 5.65 1.866 2.175 0 3.91-.537 5.161-1.6 1.251-1.063 1.88-2.607 1.88-4.59v-.435h1.792v.435c0 2.457-.796 4.398-2.378 5.753-1.583 1.354-3.774 2.035-6.52 2.035-3.003 0-5.321-.77-6.883-2.288C1.512 16.96.732 14.819.732 12.09v-.223c0-2.729.78-4.87 2.322-6.388C4.596 3.961 6.914 3.19 9.917 3.19c2.746 0 4.937.681 6.52 2.035 1.582 1.355 2.378 3.296 2.378 5.753v2.087zM8.136 13.385c.349 0 .614-.079.792-.236.177-.156.265-.372.265-.644v-1.218a1.326 1.326 0 0 0-.265-.79c-.178-.158-.443-.237-.792-.237-.35 0-.616.079-.793.237a1.326 1.326 0 0 0-.265.79v1.218c0 .272.088.488.265.644.177.157.443.236.793.236z"/>
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1JunPviNMg/",
    bg: "bg-[#1877F2]",
    svg: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
];

export function Footer() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <>
      <footer className="bg-card text-foreground border-t border-border py-12 px-4 md:px-8 transition-colors" dir={isAr ? "rtl" : "ltr"}>
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Banner Section */}
          <div className="bg-[#4A3B32]/10 dark:bg-[#FCDFC2]/10 border border-[#4A3B32]/20 dark:border-[#FCDFC2]/20 rounded-2xl p-6 md:p-8 backdrop-blur text-center md:text-start flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h3 className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center md:justify-start gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-[#4A3B32] dark:bg-[#FCDFC2]" />
                {isAr ? "إنجلشوم | اكتشف مستواك" : "EnglishOM | Discover Your Level"}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {isAr
                  ? `"البداية الذكية لرحلتك اللغوية. صممنا هذه الأداة التفاعلية لتشخيص مهاراتك الحالية بدقة، لتنطلق في ممارستك الذاتية من نقطة تناسبك تماماً."`
                  : `"The smart start to your language journey. We designed this interactive tool to diagnose your current skills with precision, empowering your self-practice from your exact right starting point."`}
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {SocialIcons.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  className={`w-9 h-9 rounded-xl ${social.bg} flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 hover:shadow-lg`}
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Navigation Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
            
            {/* Column 1: Test Your Language (اختبر لغتك) */}
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-foreground border-b-2 border-[#4A3B32] dark:border-[#FCDFC2] pb-2 inline-block">
                {isAr ? "اختبر لغتك" : "Test Your Language"}
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://englishom.com/ques"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <span className="text-xs text-[#4A3B32] dark:text-[#FCDFC2]">●</span>
                    {isAr ? "مستوى الكفاءة" : "Proficiency Level"}
                  </a>
                </li>
                <li>
                  <a
                    href="https://englishom.com/test"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <span className="text-xs text-[#4A3B32] dark:text-[#FCDFC2]">●</span>
                    {isAr ? "اكتشف مستواك" : "Discover Your Level"}
                  </a>
                </li>
                <li>
                  <a
                    href="https://englishom.com/test1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <span className="text-xs text-[#4A3B32] dark:text-[#FCDFC2]">●</span>
                    {isAr ? "مؤشر الإنجاز" : "Achievement Indicator"}
                  </a>
                </li>
                <li>
                  <a
                    href="https://englishom.com/blog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <span className="text-xs text-[#4A3B32] dark:text-[#FCDFC2]">●</span>
                    {isAr ? "المدونة" : "Blog"}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Training & Practice */}
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-foreground border-b-2 border-[#4A3B32] dark:border-[#FCDFC2] pb-2 inline-block">
                {isAr ? "التدريب والممارسة" : "Training & Practice"}
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://englishom.com/Landingpage/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    {isAr ? "أبدأ الممارسة الذكية" : "Start Smart Practice"}
                  </a>
                </li>
                <li>
                  <a
                    href={isAr ? "https://englishom.com/ar/app" : "https://englishom.com/en/app"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    {isAr ? "تسجيل الدخول" : "Login"}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-foreground border-b-2 border-[#4A3B32] dark:border-[#FCDFC2] pb-2 inline-block">
                {isAr ? "الدعم" : "Support"}
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <a
                    href={isAr ? "https://englishom.com/ar/user-guide" : "https://englishom.com/en/user-guide"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    {isAr ? "دليل المستخدم" : "User Guide"}
                  </a>
                </li>
                <li>
                  <a
                    href={isAr ? "https://englishom.com/ar/contact" : "https://englishom.com/en/contact"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    {isAr ? "اتصل بنا" : "Contact Us"}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-foreground border-b-2 border-[#4A3B32] dark:border-[#FCDFC2] pb-2 inline-block">
                {isAr ? "قانوني" : "Legal"}
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <a
                    href={isAr ? "https://englishom.com/ar/terms-and-conditions" : "https://englishom.com/en/terms-and-conditions"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    {isAr ? "الشروط والأحكام" : "Terms & Conditions"}
                  </a>
                </li>
                <li>
                  <a
                    href={isAr ? "https://englishom.com/ar/privacy-policy" : "https://englishom.com/en/privacy-policy"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowDisclaimer(true)}
                    className="hover:text-foreground transition-colors text-left rtl:text-right w-full bg-transparent border-0 p-0 cursor-pointer"
                  >
                    {isAr ? "إخلاء المسؤولية" : "Disclaimer"}
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom copyright */}
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
            <p>© 2026 {isAr ? "إنجلشوم (EnglishOM). جميع الحقوق محفوظة." : "EnglishOM. All rights reserved."}</p>
            <div className="flex gap-4">
              <a href="https://englishom.com/blog" className="hover:text-foreground transition-colors">
                {isAr ? "المدونة" : "Blog"}
              </a>
              <a href="https://englishom.com" className="hover:text-foreground transition-colors">
                EnglishOM.com
              </a>
            </div>
          </div>

        </div>
      </footer>

      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 text-start text-foreground"
            dir={isAr ? "rtl" : "ltr"}
          >
            <button
              onClick={() => setShowDisclaimer(false)}
              className="absolute top-4 left-4 rtl:left-auto rtl:right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-xl font-bold mb-4 mt-2 text-center md:text-start">
              {isAr ? "إخلاء المسؤولية" : "Disclaimer"}
            </h3>
            
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-justify mb-2 whitespace-pre-line">
              {isAr ? (
                "هذه الأداة مصممة لتكون بوصلتك السريعة نحو نقطة الانطلاق المناسبة في ممارستك الذاتية، وهي مؤشر تفاعلي تقريبي لتوجيه خطواتك وليست حكماً نهائياً أو مرجعاً رسمياً لتقدير القدرات."
              ) : (
                "This tool is designed to be your quick compass towards the appropriate starting point in your self-practice. It is an approximate interactive indicator to guide your steps, not a final judgment or an official reference for assessing abilities."
              )}
            </p>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDisclaimer(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-[#4A3B32] text-[#FCDFC2] hover:bg-[#3B2E26] dark:bg-[#FCDFC2] dark:text-[#120F0D] dark:hover:bg-[#f3cfad] transition-all"
              >
                {isAr ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
