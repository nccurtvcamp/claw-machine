import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useKeyboardControls } from "@react-three/drei";
import gsap from "gsap";


function ClawCamera({clawPos, setClawPos, isClawDown, setIsClawDown, onClawUp, setPendingResult, showResult, pendingResult}){
    const camRef = useRef();

    const [, getKeys] = useKeyboardControls();


    const speed = 0.05;
    const limitX = 0.4;
    const limitY = 0.4;
    const limitZ = 0.3;
    

    useFrame(()=>{
        const { forward, backward, left, right, jump } = getKeys();

        if(!isClawDown && !showResult && !pendingResult){
            if (forward) {
                if (clawPos.z > -limitZ) {
                  setClawPos({ x: clawPos.x, y: clawPos.y, z: clawPos.z - speed });
                }
              }
              
              if (backward) {
                if (clawPos.z < limitZ) {
                  setClawPos({ x: clawPos.x, y: clawPos.y, z: clawPos.z + speed });
                }
              }
    
            if(right){
                if(clawPos.x < limitX){
                    setClawPos({x:clawPos.x + speed, y:clawPos.y, z:clawPos.z});
                }
            }
    
            if(left){
                if(clawPos.x > -limitX){
                    setClawPos({x:clawPos.x - speed, y:clawPos.y, z:clawPos.z});
                }
            }

            if(jump){
                setPendingResult(true);
                setIsClawDown(true);
                gsap.to(clawPos, {y: -0.5, duration: 3, onComplete: ()=>{
                    gsap.to(clawPos, {y: 0.3, duration: 2, onComplete: ()=>{
                        setIsClawDown(false);
                        if (onClawUp) onClawUp();
                    }});
                }});
            }
        }

        if(camRef.current){
            camRef.current.lookAt(0, 1, 0);
        }
    });

    return(<>
        <PerspectiveCamera
          ref={camRef}
          makeDefault
          position={[0, 1, 3]} // 3 ~ 6
        />
    </>)
}

export default ClawCamera;