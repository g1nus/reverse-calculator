'use client';

import style from '@/app/heart.module.css';

type Props = {
  alive: boolean;
};

export default function Heart({alive} : Props) {
  return (
    <svg id="Layer_1" className={style.of} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">

    <path id="right_h" className={alive ? `${style.cls_1}` : `${style.cls_1} ${style.right_animate}`} 
      d="M960.07,390.78c-46,259.3-460,481-460,481L470.72,722.36l87.85-171.5L445.64,387.77,500,256.5C594.12,32.44,1010.27,77.08,960.07,390.78Z"/>
    <path id="left_h" className={alive ? `${style.cls_1}` : `${style.cls_1} ${style.left_animate}`} 
      d="M470.72,722.36,500,871.75S85.93,650.08,40,390.78C-10.25,77.08,405.91,32.44,500,256.5L445.64,387.77,558.57,550.86Z"/>
    <circle id="h_l_l_base_l" className={style.cls_2} cx="457.59" cy="930.8" r="10.25"/>
    <circle id="h_l_l_base_r" className={style.cls_2} cx="542.44" cy="930.8" r="10.25"/>
    <circle id="h_l_l_base" className={style.cls_2} cx="500.01" cy="930.8" r="10.25"/>
    <circle id="h_l_base" className={style.cls_2} cx="500.01" cy="871.75" r="10.25"/>
    <circle id="h_base" className={style.cls_2} cx="500.01" cy="901.27" r="10.25"/>
    </svg>
  );
}
