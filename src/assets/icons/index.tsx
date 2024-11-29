import { SvgIcon } from '@mui/material';
import { Map, SupportAgent, Check } from '@mui/icons-material';

interface IconProps {
    color: string;
}

export const BancoProyectoIcon = ( {color}: IconProps ) => {
    return (
        <SvgIcon>
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="1920.000000pt"
            height="1920.000000pt"
            viewBox="0 0 1920 1920"
            preserveAspectRatio="xMidYMid meet">
            <g  transform="translate(0.000000,1920.000000) scale(0.100000,-0.100000)"
                fill={color}
                stroke="none">
                <path 
                    d="M5150 15551 c-36 -16 -193 -81 -350 -146 -157 -65 -287 -119 -289 -121 -2 -2 20 -126 48 -275 31 -155 55 -312 58 -368 15 -283 -100 -586 -302 -800 -223 -236 -544 -366 -860 -348 -55 3 -219 29 -364 57 -145 27 -265 49 -267 48 -1 -2 -34 -79 -72 -173 -38 -93 -99 -241 -136 -327 -36 -86 -66 -163 -66 -170 1 -7 96 -80 212 -163 117 -82 243 -179 282 -215 143 -134 261 -333 312 -525 22 -82 28 -130 31 -262 8 -245 -21 -393 -113 -575 -100 -200 -202 -306 -502 -520 -193 -138 -223 -163 -218 -182 12 -44 275 -671 284 -674 5 -1 101 15 213 37 250 49 344 57 474 41 182 -22 356 -86 508 -187 92 -61 253 -216 329 -317 152 -201 241 -489 225 -725 -4 -46 -23 -180 -43 -298 -20 -117 -34 -216 -31 -219 5 -6 598 -253 660 -276 15 -6 29 -9 31 -7 2 2 57 76 123 164 179 238 290 339 481 434 170 86 311 111 610 111 296 0 437 -27 620 -119 163 -82 266 -175 481 -434 63 -75 117 -137 120 -137 3 0 152 61 331 135 298 123 325 136 323 157 0 13 -13 98 -27 189 -14 91 -26 206 -26 256 0 237 80 475 223 665 73 96 345 363 426 417 89 61 252 136 346 161 163 42 259 46 510 21 125 -13 228 -21 230 -19 12 12 264 631 260 638 -3 5 -76 64 -163 131 -186 147 -273 233 -349 347 -137 206 -192 415 -193 733 0 259 31 422 115 597 92 193 185 297 440 498 99 78 149 123 148 135 -2 13 -250 618 -257 626 -1 2 -99 -10 -217 -26 -296 -40 -350 -44 -459 -31 -189 21 -357 80 -503 177 -92 60 -292 255 -369 357 -116 155 -187 345 -208 554 -13 125 -5 214 45 467 19 99 35 187 35 196 0 10 -37 30 -112 61 -62 26 -228 94 -368 152 -140 58 -258 102 -261 98 -4 -4 -72 -106 -152 -227 -154 -234 -220 -312 -348 -407 -199 -150 -407 -218 -664 -218 -217 0 -398 49 -569 153 -191 116 -273 205 -475 516 -68 105 -126 191 -130 190 -3 0 -35 -13 -71 -28z m1491 -1842 c707 -72 1324 -493 1639 -1119 136 -271 207 -547 217 -851 12 -352 -50 -647 -202 -965 -268 -561 -781 -972 -1385 -1110 -928 -213 -1875 233 -2298 1081 -151 304 -214 571 -215 910 -1 356 65 634 223 943 382 750 1194 1196 2021 1111z"/>
                <path 
                    d="M11505 10959 c-66 -28 -219 -91 -340 -141 -121 -50 -223 -94 -227 -97 -4 -3 16 -121 44 -261 49 -245 51 -262 52 -425 1 -156 -2 -178 -27 -268 -58 -209 -147 -367 -285 -506 -130 -131 -264 -216 -428 -272 -223 -76 -404 -77 -769 -6 -126 25 -240 47 -253 49 -22 3 -32 -19 -156 -317 -73 -176 -136 -329 -139 -340 -5 -17 26 -43 206 -170 247 -175 363 -283 455 -422 261 -400 236 -974 -59 -1349 -79 -101 -174 -181 -397 -339 -179 -127 -210 -153 -205 -170 3 -11 67 -167 142 -347 113 -274 139 -328 155 -328 11 0 101 17 200 37 170 35 192 38 361 37 153 0 192 -3 260 -21 236 -65 403 -167 589 -364 212 -223 312 -455 323 -749 4 -125 2 -152 -36 -370 -22 -129 -37 -237 -33 -241 4 -4 93 -41 197 -84 105 -43 253 -104 329 -136 76 -33 145 -59 152 -59 7 0 62 64 120 142 59 79 130 169 158 202 74 87 214 190 341 251 194 95 351 121 674 112 272 -7 408 -39 581 -134 148 -81 242 -167 445 -408 65 -77 123 -141 130 -143 7 -2 108 37 226 86 118 49 262 109 321 133 71 29 108 49 108 59 0 9 -11 83 -24 165 -35 211 -40 286 -27 395 23 189 83 360 176 501 62 94 365 403 460 468 260 179 502 230 888 187 160 -18 217 -20 217 -6 0 5 57 145 126 311 69 165 123 306 121 313 -3 7 -76 69 -164 137 -87 68 -186 152 -219 187 -126 128 -232 316 -281 497 -27 98 -27 105 -27 395 0 288 0 297 26 393 51 186 157 373 285 502 36 36 135 120 220 187 85 67 157 127 160 134 2 7 -52 148 -121 313 -69 166 -126 306 -126 311 0 15 -53 12 -246 -15 -322 -46 -450 -44 -642 11 -196 55 -356 158 -538 345 -154 159 -227 273 -287 450 -72 208 -74 403 -8 723 23 110 38 203 34 206 -5 4 -136 60 -293 125 -157 64 -316 130 -355 146 -38 16 -75 29 -81 29 -6 0 -76 -97 -154 -216 -152 -231 -241 -336 -359 -423 -446 -330 -1064 -281 -1456 115 -60 60 -116 137 -225 302 -86 131 -151 222 -160 221 -8 0 -69 -23 -135 -50z m1510 -1809 c219 -17 410 -61 612 -139 467 -182 864 -549 1088 -1006 157 -320 230 -690 205 -1039 -46 -646 -378 -1218 -917 -1578 -125 -84 -341 -189 -485 -236 -218 -71 -416 -102 -650 -102 -550 0 -1060 211 -1448 600 -491 491 -696 1176 -559 1870 78 390 296 784 590 1065 380 361 849 553 1399 573 25 1 99 -3 165 -8z"/>
            </g>
        </svg>
        </SvgIcon>
    )
}

export const MapICon = ( {color}: IconProps ) => {
    return (
        <Map style={{ fill: color }}/>
    )
}

export const CheckICon = ( {color}: IconProps ) => {
    return (
        <Check style={{ fill: color }}/>
    )
}

export const PlanIndicativoIcon = ( {color}: IconProps ) => {
    return (
        <SvgIcon>
        <svg 
            width="100" 
            height="100" 
            viewBox="0 0 50 50" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg">
        <path 
            d="M25 50C21.5417 50 18.2917 49.3438 15.25 48.0312C12.2083 46.7188 9.5625 44.9375 7.3125 42.6875C5.0625 40.4375 3.28125 37.7917 1.96875 34.75C0.65625 31.7083 0 28.4583 0 25C0 18.5417 2.14583 12.9375 6.4375 8.1875C10.7292 3.4375 16.0833 0.75 22.5 0.125V7.625C18.1667 8.20833 14.5833 10.1458 11.75 13.4375C8.91667 16.7292 7.5 20.5833 7.5 25C7.5 29.875 9.19792 34.0104 12.5938 37.4062C15.9896 40.8021 20.125 42.5 25 42.5C27.6667 42.5 30.1979 41.9375 32.5938 40.8125C34.9896 39.6875 37.0417 38.0833 38.75 36L45.25 39.75C42.875 43 39.9167 45.5208 36.375 47.3125C32.8333 49.1042 29.0417 50 25 50ZM47.875 35.125L41.375 31.375C41.75 30.3333 42.0312 29.2812 42.2188 28.2188C42.4062 27.1562 42.5 26.0833 42.5 25C42.5 20.5833 41.0833 16.7292 38.25 13.4375C35.4167 10.1458 31.8333 8.20833 27.5 7.625V0.125C33.9167 0.75 39.2708 3.4375 43.5625 8.1875C47.8542 12.9375 50 18.5417 50 25C50 26.75 49.8438 28.4792 49.5312 30.1875C49.2188 31.8958 48.6667 33.5417 47.875 35.125Z"
            fill={color}/>
        </svg>
        </SvgIcon>
    )
}

export const PlanIndicativoLogo = ( {color}: IconProps ) => {
    return (
        <SvgIcon>
            <svg
                version="1.0" 
                xmlns="http://www.w3.org/2000/svg"
                width="20.000000pt" 
                height="26.000000pt" 
                viewBox="5 0 30.000000 26.000000"
                preserveAspectRatio="xMidYMid meet">
                <g  transform="translate(0.000000,53.000000) scale(0.100000,-0.100000)"
                    fill={color}
                    stroke="none">
                    <path d="M114 386 c-19 -19 -34 -44 -34 -57 0 -23 1 -22 19 7 10 17 33 37 51 44 27 11 36 11 66 -4 24 -11 41 -13 52 -7 13 8 10 12 -19 30 -52 32 -94 28 -135 -13z"/>
                    <path d="M225 335 c-58 -33 -79 -61 -43 -59 20 2 118 73 118 86 0 13 -12 9 -75 -27z m-35 -45 c0 -5 -4 -10 -10 -10 -5 0 -10 5 -10 10 0 6 5 10 10 10 6 0 10 -4 10 -10z"/>
                    <path d="M282 328 c-18 -18 -14 -38 8 -38 13 0 20 7 20 19 0 25 -13 34 -28 19z"/>
                </g>
            </svg>
        </SvgIcon>
    )
}

export const MapaIcon = ( {color}: IconProps ) => {
    return (
        <SvgIcon>
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 1920.000000 1920.000000" preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,1920.000000) scale(0.100000,-0.100000)" fill="#FFFFFF" stroke="none">
                <path d="M10820 16890 c-647 -54 -1247 -368 -1643 -860 -160 -199 -326 -496 -397 -710 -162 -489 -169 -939 -23 -1393 73 -228 164 -423 475 -1012 186 -352 392 -743 488 -925 407 -774 514 -977 600 -1140 54 -102 162 -306 240 -455 78 -148 191 -362 250 -475 60 -113 110 -210 112 -216 2 -6 -37 -56 -86 -112 -132 -151 -127 -131 -48 -194 93 -75 90 -74 115 -41 12 15 54 64 94 109 l72 81 -27 26 -26 27 59 112 c32 62 66 126 76 141 l17 28 57 -65 57 -65 87 72 c47 40 99 81 115 93 l29 21 -59 79 c-32 43 -59 81 -61 83 -1 2 -43 -28 -93 -68 -49 -39 -90 -69 -90 -66 0 3 40 81 89 173 49 92 202 383 341 647 139 264 296 563 350 665 142 269 366 694 490 930 59 113 170 322 245 465 432 815 533 1054 597 1415 20 116 17 506 -5 649 -38 239 -101 437 -216 676 -335 694 -1012 1182 -1786 1290 -129 18 -374 26 -495 15z m356 -1341 c136 -24 293 -91 412 -176 446 -318 554 -945 241 -1399 -103 -149 -284 -294 -455 -363 -140 -57 -194 -66 -384 -65 -161 0 -182 3 -265 28 -173 53 -316 137 -441 261 -120 119 -194 237 -247 397 -40 119 -51 192 -50 333 1 106 5 148 27 230 89 341 338 608 670 720 41 14 98 29 128 34 76 12 294 13 364 0z"/>
                <path d="M12736 12388 c-68 -128 -91 -177 -85 -181 2 -2 365 -75 807 -162 l802 -159 26 -86 c14 -47 79 -258 144 -470 187 -611 192 -629 188 -660 -3 -20 0 -30 11 -33 11 -3 32 -56 64 -163 57 -190 300 -983 437 -1429 54 -176 158 -513 230 -750 278 -909 395 -1291 486 -1584 52 -168 92 -306 90 -309 -3 -2 -422 39 -933 92 -510 53 -1151 118 -1423 146 -272 27 -544 55 -603 61 l-108 12 -27 -25 c-15 -14 -546 -492 -1180 -1062 l-1153 -1038 -37 6 c-20 4 -392 42 -827 86 -434 44 -1091 111 -1460 150 -368 38 -706 72 -750 76 l-81 7 -1144 -1031 c-845 -760 -1147 -1026 -1153 -1016 -4 8 -66 182 -137 387 -70 204 -185 536 -255 737 -70 201 -169 487 -220 635 -51 149 -151 434 -220 635 -289 832 -391 1128 -471 1360 -47 135 -126 361 -175 503 -50 142 -88 265 -85 274 4 8 0 21 -8 27 -14 10 -53 118 -232 634 l-73 214 47 51 c50 54 526 571 812 882 91 99 192 209 226 245 34 36 298 324 589 640 290 316 537 585 549 597 20 21 25 22 81 13 33 -6 416 -66 850 -134 435 -68 1140 -179 1568 -247 l779 -122 556 556 556 556 -71 138 c-40 76 -76 139 -81 141 -5 1 -247 -238 -538 -531 l-529 -534 -460 73 c-702 110 -2018 317 -2415 379 -195 30 -363 57 -372 59 -16 4 -186 -179 -1832 -1969 -324 -352 -606 -658 -628 -681 -36 -38 -38 -43 -27 -70 6 -16 70 -198 141 -404 72 -206 186 -536 254 -732 68 -197 180 -519 248 -715 243 -701 389 -1122 481 -1388 95 -274 245 -708 472 -1360 68 -198 182 -526 253 -730 209 -602 227 -656 234 -662 4 -4 25 11 49 34 36 35 2418 2177 2472 2223 19 17 36 16 335 -16 173 -18 540 -56 815 -84 275 -28 826 -85 1225 -126 399 -41 744 -73 767 -72 40 3 85 42 1208 1053 655 589 1176 1051 1188 1053 24 3 342 -28 1452 -143 1119 -116 1927 -196 1930 -193 1 2 -30 109 -70 238 -70 225 -176 571 -465 1515 -72 237 -176 574 -230 750 -54 176 -157 512 -229 748 -72 235 -190 619 -262 855 -72 235 -175 571 -229 747 -54 176 -162 527 -239 779 -78 253 -143 461 -145 463 -2 2 -377 78 -832 168 -456 91 -839 167 -851 170 -19 4 -29 -8 -77 -97z"/>
                <path d="M14024 10881 c-2 -2 -4 -46 -4 -98 0 -66 4 -95 13 -97 6 -3 73 -7 149 -10 l136 -6 7 95 c4 53 4 99 0 103 -7 8 -294 20 -301 13z"/>
                <path d="M13635 10875 c-5 -2 -59 -7 -119 -10 l-108 -7 6 -82 c11 -127 11 -126 60 -120 22 3 88 9 145 12 l104 7 -2 94 c-1 52 -5 99 -7 103 -5 8 -59 10 -79 3z"/>
                <path d="M13030 10799 c-125 -24 -230 -52 -230 -60 0 -10 41 -182 45 -186 2 -4 279 57 283 62 4 4 -10 97 -24 168 -6 29 -6 29 -74 16z"/>
                <path d="M12346 10612 c-71 -26 -131 -53 -133 -59 -7 -19 65 -178 79 -176 18 2 256 88 262 94 10 9 -55 189 -67 189 -7 -1 -70 -22 -141 -48z"/>
                <path d="M11885 10411 c-16 -10 -76 -44 -133 -75 -57 -32 -102 -61 -100 -64 17 -39 95 -155 105 -159 7 -3 19 -1 26 5 6 5 59 36 117 67 58 32 106 59 108 60 3 3 -87 186 -91 184 -1 0 -15 -9 -32 -18z"/>
                <path d="M10512 9173 c-15 -22 -90 -143 -138 -225 -3 -4 35 -30 83 -58 68 -40 90 -49 96 -38 4 7 39 63 77 123 37 61 66 113 63 118 -5 8 -149 107 -157 107 -2 0 -13 -12 -24 -27z"/>
                <path d="M10212 8643 c-12 -23 -112 -253 -112 -257 0 -5 182 -78 185 -74 2 2 30 62 63 134 l59 131 -83 41 c-96 48 -100 49 -112 25z"/>
                <path d="M9987 8083 c-3 -5 -23 -69 -46 -143 -28 -93 -37 -136 -29 -141 16 -10 178 -53 182 -48 12 14 86 273 79 279 -8 7 -162 60 -175 60 -4 0 -9 -3 -11 -7z"/>
                <path d="M9746 7390 c-33 -72 -57 -132 -55 -134 12 -11 157 -86 166 -86 12 0 121 226 125 258 3 21 -7 28 -81 58 -47 19 -88 34 -91 34 -3 0 -32 -59 -64 -130z"/>
                <path d="M3730 7179 c-24 -48 -41 -91 -38 -94 3 -3 63 -34 134 -69 l129 -64 36 72 c60 117 67 102 -84 178 l-134 66 -43 -89z"/>
                <path d="M9496 6969 c-16 -23 -56 -73 -89 -111 l-61 -71 74 -68 75 -69 34 38 c50 55 161 195 161 203 0 8 -133 107 -153 114 -7 3 -25 -14 -41 -36z"/>
                <path d="M4272 6910 l-41 -90 47 -20 c185 -83 233 -103 235 -99 8 10 78 181 75 183 -8 7 -260 116 -267 116 -4 0 -26 -40 -49 -90z"/>
                <path d="M4835 6683 c-19 -48 -34 -92 -31 -98 5 -15 268 -117 277 -108 12 14 70 176 64 181 -3 3 -42 20 -88 38 -45 17 -105 41 -134 52 l-51 21 -37 -86z"/>
                <path d="M9014 6517 l-121 -79 46 -84 c25 -46 51 -84 57 -84 23 0 254 154 254 170 0 4 -26 41 -58 82 l-57 75 -121 -80z"/>
                <path d="M5431 6542 c-16 -32 -64 -172 -60 -176 3 -2 201 -68 276 -91 8 -3 23 31 42 93 17 53 29 97 28 98 -1 1 -64 22 -140 47 -123 41 -138 44 -146 29z"/>
                <path d="M6002 6358 c-18 -47 -46 -168 -40 -173 12 -12 281 -76 288 -68 4 4 15 42 24 83 9 41 19 82 22 91 4 13 -18 22 -123 48 -71 18 -136 34 -145 37 -12 4 -21 -2 -26 -18z"/>
                <path d="M8500 6277 c-69 -21 -130 -41 -137 -43 -11 -3 -10 -12 28 -157 10 -37 12 -39 44 -33 47 9 248 75 258 85 8 8 -47 168 -62 182 -3 3 -62 -12 -131 -34z"/>
                <path d="M6580 6184 c-6 -33 -15 -76 -20 -97 -6 -27 -5 -40 4 -43 7 -3 74 -15 150 -28 96 -16 139 -20 141 -12 6 17 25 152 25 173 0 16 -16 21 -107 36 -60 9 -124 20 -145 23 l-36 6 -12 -58z"/>
                <path d="M7880 6156 l-105 -11 4 -95 c1 -52 5 -97 7 -99 9 -9 292 14 303 25 2 2 -2 46 -9 99 l-13 95 -41 -1 c-22 -1 -88 -7 -146 -13z"/>
                <path d="M7175 6093 c-3 -38 -8 -82 -11 -99 -6 -39 -3 -40 172 -49 l131 -7 6 47 c4 26 7 72 7 101 l0 53 -52 5 c-29 3 -97 8 -150 11 l-96 5 -7 -67z"/>
            </g>
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

export const MarkerIcon = () => {
    return (
        <svg 
            viewBox="0 0 100 100" 
            y="0" 
            x="0" 
            xmlns="http://www.w3.org/2000/svg" 
            id="圖層_1" 
            version="1.1" 
            width="200px" 
            height="200px" >
            <g>
                <circle 
                    stroke-miterlimit="10" 
                    stroke-width="8" 
                    stroke="#000" 
                    r="38" 
                    cy="50" 
                    cx="50">
                </circle>
                <g>
                    <path 
                        fill="#fff" 
                        d="M54.9 28.4h-8.7c-1 0-1.8.8-1.8 1.8v7.6c0 1 .8 1.8 1.8 1.8h8.7c1 0 1.8-.8 1.8-1.8v-7.6c0-1-.8-1.8-1.8-1.8z" >
                    </path>
                    <path 
                        fill="#fff" 
                        d="M56.7 63V45.4c0-1-.8-1.8-1.8-1.8H42.7c-1 0-1.8.8-1.8 1.8V50c0 1 .8 1.8 1.8 1.8h2.9V63h-2.9c-1 0-1.8.8-1.8 1.8v5.1c0 1 .8 1.8 1.8 1.8h16.8c1 0 1.8-.8 1.8-1.8v-5.1c0-1-.8-1.8-1.8-1.8h-2.8z">
                    </path>
                </g>
            </g>
        </svg>
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
                            strokeMiterlimit="10"
                            strokeWidth="6" 
                            stroke="#e0e0e0" 
                            fill="none"></path>
                        <path 
                            d="M77.912 90H17.794" 
                            strokeDasharray="7.5147,8.5882" 
                            strokeMiterlimit="10" 
                            strokeWidth="6" 
                            stroke="#e0e0e0" 
                            fill="none"></path>
                        <path 
                            d="M13.5 90H10v-3.5" 
                            strokeMiterlimit="10" 
                            strokeWidth="6" 
                            stroke="#e0e0e0" 
                            fill="none"></path>
                        <path 
                            d="M10 77.912V17.794" 
                            strokeDasharray="7.5147,8.5882" 
                            strokeMiterlimit="10" 
                            strokeWidth="6" 
                            stroke="#e0e0e0" 
                            fill="none"></path>
                        <path 
                            d="M10 13.5V10h3.5" 
                            strokeMiterlimit="10" 
                            strokeWidth="6" 
                            stroke="#e0e0e0" 
                            fill="none"></path>
                        <path 
                            d="M22.088 10h60.118" 
                            strokeDasharray="7.5147,8.5882" 
                            strokeMiterlimit="10" 
                            strokeWidth="6" 
                            stroke="#e0e0e0" 
                            fill="none"></path>
                        <path 
                            d="M86.5 10H90v3.5" 
                            strokeMiterlimit="10" 
                            strokeWidth="6" 
                            stroke="#e0e0e0" 
                            fill="none"></path>
                        <path 
                            d="M90 22.088v60.118" 
                            strokeDasharray="7.5147,8.5882" 
                            strokeMiterlimit="10" 
                            strokeWidth="6" 
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

export const LocationIcon = ( {color}: IconProps ) => {
    return (
        <SvgIcon>
            <svg fill={color} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
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

export const PQRSIcon = ( {color}: IconProps ) => {
    return (
        <SupportAgent style={{ fill: color }}/>
    )
}
