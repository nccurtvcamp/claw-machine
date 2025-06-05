"use client"

import Image from "next/image";
import { Canvas,useFrame } from "@react-three/fiber";
import { CameraControls, RoundedBox,Environment,useGLTF,ContactShadows,PerspectiveCamera
  ,axesHelper,KeyboardControls, useKeyboardControls, Box } from "@react-three/drei";
import { Suspense ,useRef,useState} from "react";
import ClawCamera from "@/component/ClawCamera";


function ClawModel({clawPos}){
  const clawModel = useGLTF("claw.glb");
  const clawRef = useRef();

  useFrame(()=>{
    if(clawRef.current){
      clawRef.current.traverse((child)=>{

        if(child.name == "claw"){
          child.position.set(clawPos.x,clawPos.y +2.85 ,clawPos.z);
        }
        if(child.name == "clawbase"){
          child.position.set(clawPos.x,2.85 ,clawPos.z);
        }
        if(child.name == "track"){
          child.position.set(0, 2.85 ,clawPos.z);
        }

      });
    }
  });

  return(<>
    <primitive
            ref={clawRef}
            object={clawModel.scene}
            scale={[0.6, 0.6, 0.6]}
            position={[clawPos.x,clawPos.y,clawPos.z]}
            rotation={[0, 0, 0]}
    />
  </>)
}


export default function Home() {


  const clawModel = useGLTF("claw.glb");
  const [clawPos, setClawPos] = useState({x:0 ,y:0 ,z:0 });
  const [isClawDown, setIsClawDown] = useState



  return (
    <div className="w-full h-screen">
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
     <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
     <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
    
      <Box args={[1,1,1]}></Box>
      

      <Suspense fallback={null}>
          <ClawModel clawPos={clawPos} isClawDown={isClawDown}/>
        </Suspense>

     <ContactShadows opacity={1} scale={10} blur={5} far={10} resolution={256} color="#000000" />


      <Environment
        background={true} // can be true, false or "only" (which only sets the background) (default: false)
        backgroundBlurriness={0} // optional blur factor between 0 and 1 (default: 0, only works with three 0.146 and up)
        backgroundIntensity={1} // optional intensity factor (default: 1, only works with three 0.163 and up)
        environmentIntensity={1} // optional intensity factor (default: 1, only works with three 0.163 and up)
        preset={'forest'}
      />
      
      <ClawCamera  clawPos={clawPos} setClawPos={setClawPos} isClawDown={isClawDown} setIsClawDown={setIsClawDown}></ClawCamera>
      <CameraControls/>

      <axesHelper args ={[10]}/>

    

  </Canvas>
  </KeyboardControls>
    </div>
  );
}
