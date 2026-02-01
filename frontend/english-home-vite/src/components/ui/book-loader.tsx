import { cn } from '@lib/utils';
import { FC } from 'react';

const BookLoader: FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={cn('flex items-center justify-center', className)}>
            <div className="book-loader">
                <div className="inner">
                    <div className="left"></div>
                    <div className="middle"></div>
                    <div className="right"></div>
                </div>
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
            <style jsx>{`
        .book-loader {
          --color: #fff;
          --duration: 6.8s;
          width: 32px;
          height: 12px;
          position: relative;
          margin: 32px 0 0 0;
          zoom: 1.5;
        }

        .book-loader .inner {
          width: 32px;
          height: 12px;
          position: relative;
          transform-origin: 2px 2px;
          transform: rotateZ(-90deg);
          animation: book var(--duration) ease infinite;
        }

        .book-loader .inner .left,
        .book-loader .inner .right {
          width: 60px;
          height: 4px;
          top: 0;
          border-radius: 2px;
          background: var(--color);
          position: absolute;
        }

        .book-loader .inner .left {
          right: 28px;
          transform-origin: 58px 2px;
          transform: rotateZ(90deg);
          animation: left var(--duration) ease infinite;
        }

        .book-loader .inner .right {
          left: 28px;
          transform-origin: 2px 2px;
          transform: rotateZ(-90deg);
          animation: right var(--duration) ease infinite;
        }

        .book-loader .inner .middle {
          width: 32px;
          height: 12px;
          border: 4px solid var(--color);
          border-top: 0;
          border-radius: 0 0 9px 9px;
          transform: translateY(2px);
        }

        .book-loader ul {
          margin: 0;
          padding: 0;
          list-style: none;
          position: absolute;
          left: 50%;
          top: 0;
        }

        .book-loader ul li {
          height: 4px;
          border-radius: 2px;
          transform-origin: 100% 2px;
          width: 48px;
          right: 0;
          top: -10px;
          position: absolute;
          background: var(--color);
          transform: rotateZ(0deg) translateX(-18px);
          animation-duration: var(--duration);
          animation-timing-function: ease;
          animation-iteration-count: infinite;
        }

        .book-loader ul li:nth-child(1) { animation-name: page-1; }
        .book-loader ul li:nth-child(2) { animation-name: page-2; }
        .book-loader ul li:nth-child(3) { animation-name: page-3; }
        .book-loader ul li:nth-child(4) { animation-name: page-4; }
        .book-loader ul li:nth-child(5) { animation-name: page-5; }
        .book-loader ul li:nth-child(6) { animation-name: page-6; }
        .book-loader ul li:nth-child(7) { animation-name: page-7; }
        .book-loader ul li:nth-child(8) { animation-name: page-8; }
        .book-loader ul li:nth-child(9) { animation-name: page-9; }
        .book-loader ul li:nth-child(10) { animation-name: page-10; }
        .book-loader ul li:nth-child(11) { animation-name: page-11; }
        .book-loader ul li:nth-child(12) { animation-name: page-12; }
        .book-loader ul li:nth-child(13) { animation-name: page-13; }
        .book-loader ul li:nth-child(14) { animation-name: page-14; }
        .book-loader ul li:nth-child(15) { animation-name: page-15; }
        .book-loader ul li:nth-child(16) { animation-name: page-16; }
        .book-loader ul li:nth-child(17) { animation-name: page-17; }
        .book-loader ul li:nth-child(18) { animation-name: page-18; }

        @keyframes page-1 { 4% { transform: rotateZ(0deg) translateX(-18px); } 13%, 54% { transform: rotateZ(180deg) translateX(-18px); } 63%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-2 { 6% { transform: rotateZ(0deg) translateX(-18px); } 15%, 52% { transform: rotateZ(180deg) translateX(-18px); } 61%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-3 { 8% { transform: rotateZ(0deg) translateX(-18px); } 17%, 50% { transform: rotateZ(180deg) translateX(-18px); } 59%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-4 { 10% { transform: rotateZ(0deg) translateX(-18px); } 19%, 48% { transform: rotateZ(180deg) translateX(-18px); } 57%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-5 { 12% { transform: rotateZ(0deg) translateX(-18px); } 21%, 46% { transform: rotateZ(180deg) translateX(-18px); } 55%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-6 { 14% { transform: rotateZ(0deg) translateX(-18px); } 23%, 44% { transform: rotateZ(180deg) translateX(-18px); } 53%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-7 { 16% { transform: rotateZ(0deg) translateX(-18px); } 25%, 42% { transform: rotateZ(180deg) translateX(-18px); } 51%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-8 { 18% { transform: rotateZ(0deg) translateX(-18px); } 27%, 40% { transform: rotateZ(180deg) translateX(-18px); } 49%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-9 { 20% { transform: rotateZ(0deg) translateX(-18px); } 29%, 38% { transform: rotateZ(180deg) translateX(-18px); } 47%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-10 { 22% { transform: rotateZ(0deg) translateX(-18px); } 31%, 36% { transform: rotateZ(180deg) translateX(-18px); } 45%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-11 { 24% { transform: rotateZ(0deg) translateX(-18px); } 33%, 34% { transform: rotateZ(180deg) translateX(-18px); } 43%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-12 { 26% { transform: rotateZ(0deg) translateX(-18px); } 35%, 32% { transform: rotateZ(180deg) translateX(-18px); } 41%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-13 { 28% { transform: rotateZ(0deg) translateX(-18px); } 37%, 30% { transform: rotateZ(180deg) translateX(-18px); } 39%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-14 { 30% { transform: rotateZ(0deg) translateX(-18px); } 39%, 28% { transform: rotateZ(180deg) translateX(-18px); } 37%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-15 { 32% { transform: rotateZ(0deg) translateX(-18px); } 41%, 26% { transform: rotateZ(180deg) translateX(-18px); } 35%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-16 { 34% { transform: rotateZ(0deg) translateX(-18px); } 43%, 24% { transform: rotateZ(180deg) translateX(-18px); } 33%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-17 { 36% { transform: rotateZ(0deg) translateX(-18px); } 45%, 22% { transform: rotateZ(180deg) translateX(-18px); } 31%, 100% { transform: rotateZ(0deg) translateX(-18px); } }
        @keyframes page-18 { 38% { transform: rotateZ(0deg) translateX(-18px); } 47%, 20% { transform: rotateZ(180deg) translateX(-18px); } 29%, 100% { transform: rotateZ(0deg) translateX(-18px); } }

        @keyframes left {
          4% { transform: rotateZ(90deg); }
          10%, 40% { transform: rotateZ(0deg); }
          46%, 54% { transform: rotateZ(90deg); }
          60%, 90% { transform: rotateZ(0deg); }
          96% { transform: rotateZ(90deg); }
        }

        @keyframes right {
          4% { transform: rotateZ(-90deg); }
          10%, 40% { transform: rotateZ(0deg); }
          46%, 54% { transform: rotateZ(-90deg); }
          60%, 90% { transform: rotateZ(0deg); }
          96% { transform: rotateZ(-90deg); }
        }

        @keyframes book {
          4% { transform: rotateZ(-90deg); }
          10%, 40% { transform: rotateZ(0deg); transform-origin: 2px 2px; }
          40.01%, 59.99% { transform-origin: 30px 2px; }
          46%, 54% { transform: rotateZ(90deg); }
          60%, 90% { transform: rotateZ(0deg); transform-origin: 2px 2px; }
          96% { transform: rotateZ(-90deg); }
        }
      `}</style>
        </div>
    );
};

export default BookLoader;
