import { SvgIcon } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';

interface IconProps {
    color: string;
}

export const BancoProyectoIcon = ( {color}: IconProps ) => {
    return (
        <SvgIcon>
        <svg 
            width="60" 
            height="60" 
            viewBox="0 0 60 60" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg">
        <path 
            d="M21.791 60L20.597 50.4C19.9502 50.15 19.3408 49.85 18.7687 49.5C18.1965 49.15 17.6368 48.775 17.0896 48.375L8.20895 52.125L0 37.875L7.68657 32.025C7.63682 31.675 7.61194 31.3375 7.61194 31.0125V28.9875C7.61194 28.6625 7.63682 28.325 7.68657 27.975L0 22.125L8.20895 7.875L17.0896 11.625C17.6368 11.225 18.209 10.85 18.806 10.5C19.403 10.15 20 9.85 20.597 9.6L21.791 0H38.209L39.403 9.6C40.0498 9.85 40.6592 10.15 41.2313 10.5C41.8035 10.85 42.3632 11.225 42.9104 11.625L51.791 7.875L60 22.125L52.3134 27.975C52.3632 28.325 52.3881 28.6625 52.3881 28.9875V31.0125C52.3881 31.3375 52.3383 31.675 52.2388 32.025L59.9254 37.875L51.7164 52.125L42.9104 48.375C42.3632 48.775 41.791 49.15 41.194 49.5C40.597 49.85 40 50.15 39.403 50.4L38.209 60H21.791ZM27.0149 54H32.9104L33.9552 46.05C35.4975 45.65 36.9279 45.0625 38.2463 44.2875C39.5647 43.5125 40.7711 42.575 41.8657 41.475L49.2537 44.55L52.1642 39.45L45.7463 34.575C45.995 33.875 46.1692 33.1375 46.2687 32.3625C46.3682 31.5875 46.4179 30.8 46.4179 30C46.4179 29.2 46.3682 28.4125 46.2687 27.6375C46.1692 26.8625 45.995 26.125 45.7463 25.425L52.1642 20.55L49.2537 15.45L41.8657 18.6C40.7711 17.45 39.5647 16.4875 38.2463 15.7125C36.9279 14.9375 35.4975 14.35 33.9552 13.95L32.9851 6H27.0896L26.0448 13.95C24.5025 14.35 23.0721 14.9375 21.7537 15.7125C20.4353 16.4875 19.2289 17.425 18.1343 18.525L10.7463 15.45L7.83582 20.55L14.2537 25.35C14.005 26.1 13.8308 26.85 13.7313 27.6C13.6318 28.35 13.5821 29.15 13.5821 30C13.5821 30.8 13.6318 31.575 13.7313 32.325C13.8308 33.075 14.005 33.825 14.2537 34.575L7.83582 39.45L10.7463 44.55L18.1343 41.4C19.2289 42.55 20.4353 43.5125 21.7537 44.2875C23.0721 45.0625 24.5025 45.65 26.0448 46.05L27.0149 54ZM30.1493 40.5C33.0348 40.5 35.4975 39.475 37.5373 37.425C39.5771 35.375 40.597 32.9 40.597 30C40.597 27.1 39.5771 24.625 37.5373 22.575C35.4975 20.525 33.0348 19.5 30.1493 19.5C27.2139 19.5 24.7388 20.525 22.7239 22.575C20.709 24.625 19.7015 27.1 19.7015 30C19.7015 32.9 20.709 35.375 22.7239 37.425C24.7388 39.475 27.2139 40.5 30.1493 40.5Z"
            fill={color}/>
        </svg>
        </SvgIcon>
    )
}

export const MapICon = ( {color}: IconProps ) => {
    return (
        <MapIcon style={{ fill: color }}/>
    )
}

export const PlanIndicativoIcon = ( {color}: IconProps ) => {
    return (
        <SvgIcon>
        <svg 
            width="60" 
            height="60" 
            viewBox="0 0 60 60" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg">
        <path 
            d="M25 50C21.5417 50 18.2917 49.3438 15.25 48.0312C12.2083 46.7188 9.5625 44.9375 7.3125 42.6875C5.0625 40.4375 3.28125 37.7917 1.96875 34.75C0.65625 31.7083 0 28.4583 0 25C0 18.5417 2.14583 12.9375 6.4375 8.1875C10.7292 3.4375 16.0833 0.75 22.5 0.125V7.625C18.1667 8.20833 14.5833 10.1458 11.75 13.4375C8.91667 16.7292 7.5 20.5833 7.5 25C7.5 29.875 9.19792 34.0104 12.5938 37.4062C15.9896 40.8021 20.125 42.5 25 42.5C27.6667 42.5 30.1979 41.9375 32.5938 40.8125C34.9896 39.6875 37.0417 38.0833 38.75 36L45.25 39.75C42.875 43 39.9167 45.5208 36.375 47.3125C32.8333 49.1042 29.0417 50 25 50ZM47.875 35.125L41.375 31.375C41.75 30.3333 42.0312 29.2812 42.2188 28.2188C42.4062 27.1562 42.5 26.0833 42.5 25C42.5 20.5833 41.0833 16.7292 38.25 13.4375C35.4167 10.1458 31.8333 8.20833 27.5 7.625V0.125C33.9167 0.75 39.2708 3.4375 43.5625 8.1875C47.8542 12.9375 50 18.5417 50 25C50 26.75 49.8438 28.4792 49.5312 30.1875C49.2188 31.8958 48.6667 33.5417 47.875 35.125Z"
            fill={color}/>
        </svg>
        </SvgIcon>
    )
}

export const PlanAccionIcon = ( {color}: IconProps ) => {
    return (
        <SvgIcon>
        <svg 
            width="46" 
            height="48" 
            viewBox="0 0 46 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg">
        <path 
            d="M34 47.5L30.5 44L34.4375 40L30.5 36.0625L34 32.5L38 36.5L41.9375 32.5L45.5 36.0625L41.5 40L45.5 44L41.9375 47.5L38 43.5625L34 47.5ZM8 42.5C8.70833 42.5 9.30208 42.2604 9.78125 41.7812C10.2604 41.3021 10.5 40.7083 10.5 40C10.5 39.2917 10.2604 38.6979 9.78125 38.2188C9.30208 37.7396 8.70833 37.5 8 37.5C7.29167 37.5 6.69792 37.7396 6.21875 38.2188C5.73958 38.6979 5.5 39.2917 5.5 40C5.5 40.7083 5.73958 41.3021 6.21875 41.7812C6.69792 42.2604 7.29167 42.5 8 42.5ZM8 47.5C5.91667 47.5 4.14583 46.7708 2.6875 45.3125C1.22917 43.8542 0.5 42.0833 0.5 40C0.5 37.9167 1.22917 36.1458 2.6875 34.6875C4.14583 33.2292 5.91667 32.5 8 32.5C9.54167 32.5 10.9479 32.9271 12.2188 33.7812C13.4896 34.6354 14.4167 35.7917 15 37.25C16.625 36.7917 17.9479 35.8958 18.9688 34.5625C19.9896 33.2292 20.5 31.7083 20.5 30V20C20.5 16.5417 21.7188 13.5938 24.1562 11.1562C26.5938 8.71875 29.5417 7.5 33 7.5H35.875L31.9375 3.5625L35.5 0L45.5 10L35.5 20L31.9375 16.5L35.875 12.5H33C30.9167 12.5 29.1458 13.2292 27.6875 14.6875C26.2292 16.1458 25.5 17.9167 25.5 20V30C25.5 33.0417 24.5208 35.7188 22.5625 38.0312C20.6042 40.3438 18.125 41.7708 15.125 42.3125C14.625 43.8542 13.7188 45.1042 12.4062 46.0625C11.0938 47.0208 9.625 47.5 8 47.5ZM4 17.5L0.5 14L4.4375 10L0.5 6.0625L4 2.5L8 6.5L11.9375 2.5L15.5 6.0625L11.5 10L15.5 14L11.9375 17.5L8 13.5625L4 17.5Z"
            fill={color}/>
        </svg>
        </SvgIcon>
    )
}

export const POAIIcon = ( {color}: IconProps ) => {
    return (
        <SvgIcon>
        <svg 
            width="46" 
            height="46" 
            viewBox="0 0 46 46" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg">
        <path 
            d="M0.5 45.5V40.5L5.5 35.5V45.5H0.5ZM10.5 45.5V30.5L15.5 25.5V45.5H10.5ZM20.5 45.5V25.5L25.5 30.5625V45.5H20.5ZM30.5 45.5V30.5625L35.5 25.5625V45.5H30.5ZM40.5 45.5V20.5L45.5 15.5V45.5H40.5ZM0.5 32.5625V25.5L18 8L28 18L45.5 0.5V7.5625L28 25.0625L18 15.0625L0.5 32.5625Z"
            fill={color}/>
        </svg>
        </SvgIcon>
    )
}

// [ldio] generated by https://loading.io
export const Spinner = () => {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="200px" 
            height="200px" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="xMidYMid">
            <circle 
                cx="50" 
                cy="50" 
                fill="none" 
                stroke="#1d0e0b" 
                strokeWidth="5" 
                r="20" 
                strokeDasharray="94.24777960769379 33.41592653589793">
                
                <animateTransform 
                    attributeName="transform" 
                    type="rotate" 
                    repeatCount="indefinite" 
                    dur="1s" 
                    values="0 50 50;360 50 50" 
                    keyTimes="0;1">
                </animateTransform>
            </circle>
        </svg>
    )
}

export const LoadIcon = () => {
    return(
        <svg 
            viewBox="0 0 100 100" 
            y="0" x="0" 
            xmlns="http://www.w3.org/2000/svg" 
            id="圖層_1" 
            version="1.1" 
            width="200px" 
            height="200px" >
            <g >
                <g>
                    <g>
                        <path 
                            d="M90 86.5V90h-3.5" 
                            stroke-miterlimit="10"
                            stroke-width="6" 
                            stroke="#e0e0e0" 
                            fill="none"></path>
                        <path 
                            d="M77.912 90H17.794" 
                            stroke-dasharray="7.5147,8.5882" 
                            stroke-miterlimit="10" 
                            stroke-width="6" 
                            stroke="#e0e0e0" 
                            fill="none"></path>
                        <path 
                            d="M13.5 90H10v-3.5" 
                            stroke-miterlimit="10" 
                            stroke-width="6" 
                            stroke="#e0e0e0" 
                            fill="none"></path>
                        <path 
                            d="M10 77.912V17.794" 
                            stroke-dasharray="7.5147,8.5882" 
                            stroke-miterlimit="10" 
                            stroke-width="6" 
                            stroke="#e0e0e0" 
                            fill="none"></path>
                        <path 
                            d="M10 13.5V10h3.5" 
                            stroke-miterlimit="10" 
                            stroke-width="6" 
                            stroke="#e0e0e0" 
                            fill="none"></path>
                        <path 
                            d="M22.088 10h60.118" 
                            stroke-dasharray="7.5147,8.5882" 
                            stroke-miterlimit="10" 
                            stroke-width="6" 
                            stroke="#e0e0e0" 
                            fill="none"></path>
                        <path 
                            d="M86.5 10H90v3.5" 
                            stroke-miterlimit="10" 
                            stroke-width="6" 
                            stroke="#e0e0e0" 
                            fill="none"></path>
                        <path 
                            d="M90 22.088v60.118" 
                            stroke-dasharray="7.5147,8.5882" 
                            stroke-miterlimit="10" 
                            stroke-width="6" 
                            stroke="#e0e0e0" 
                            fill="none"></path>    
                    </g>
                </g>
                <path 
                    fill="#333" 
                    d="M70 48H53V31a3 3 0 1 0-6 0v17H30a3 3 0 1 0 0 6h17v17a3 3 0 1 0 6 0V54h17a3 3 0 1 0 0-6z" ></path>
            </g>
        </svg>
    )
}

export const LocationIcon = () => {
    return (
        <SvgIcon>
            <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
            width="200px" height="200px" viewBox="0 0 395.71 395.71">
                <g>
                    <path d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738
                        c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388
                        C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191
                        c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"/>
                </g>
            </svg>
        </SvgIcon>
    )
}
