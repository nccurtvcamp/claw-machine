"use client"
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, CameraControls, Environment, useGLTF, ContactShadows, 
  PerspectiveCamer, axesHelper, KeyboardControls, useKeyboardControls, Box} from "@react-three/drei";
import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import ClawCamera from "@/component/ClawCamera";
import HanniImg from "@/photo/hanni.png";
import MinjiImg from "@/photo/minji.png";
import HyeinImg from "@/photo/hyein.png";
import HaerinImg from "@/photo/haerin.png";
import DanielleImg from "@/photo/danielle.png";
import Nothingmg from "@/photo/nothing.png";
import BtnImg from "@/photo/btn.png";
import IBtnImg from "@/photo/ibtn.png";
import InfoImg from "@/photo/info.png";
import MusicImg from "@/photo/music.png";
import HannicImg from "@/photo/hannic.png";
import MinjicImg from "@/photo/minjic.png";
import HyeincImg from "@/photo/hyeinc.png";
import HaerincImg from "@/photo/haerinc.png";
import DaniellecImg from "@/photo/daniellec.png";
import CollectImg from "@/photo/collect.png";

const prizeToCollect = {
  [HanniImg.src]: HannicImg,
  [MinjiImg.src]: MinjicImg,
  [HyeinImg.src]: HyeincImg,
  [HaerinImg.src]: HaerincImg,
  [DanielleImg.src]: DaniellecImg,
};

function ClawModel({clawPos, isClawDown}){
  const clawModel = useGLTF(`claw.glb`);
  const clawRef = useRef();


  useFrame(()=>{
    if(clawRef.current){
      clawRef.current.traverse((child)=>{
        
        if(child.name == "claw"){
          child.position.set(clawPos.x, clawPos.y + 2.4, clawPos.z);
        }

        if(child.name == "clawBase"){
          child.position.set(clawPos.x, 2.85, clawPos.z);
        }

        if(child.name == "track"){
          child.position.set(0, 2.85, clawPos.z);
        }

      });
    }
  });

  return (<>
    <primitive
      ref={clawRef}
      object={clawModel.scene}
      scale={[0.6, 0.6, 0.6]}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    />
  </>)
  
}




export default function Home() {

  const isHidden = true;

  const [clawPos, setClawPos] = useState({x: 0, y: 0.35, z: 0});
  const [isClawDown, setIsClawDown] = useState(false);

  // 新增中獎顯示狀態與結果
  const [showResult, setShowResult] = useState(false);
  const [resultImg, setResultImg] = useState(null);
  // 新增等待結果狀態
  const [pendingResult, setPendingResult] = useState(false);

  // 新增 info 顯示狀態
  const [showInfo, setShowInfo] = useState(false);

  // 音樂播放狀態
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // 獎品圖片陣列（全部用 import 變數）
  const prizeImgs = [
    HanniImg,
    MinjiImg,
    HyeinImg,
    HaerinImg,
    DanielleImg,
    Nothingmg
  ];

  // 收藏區狀態（存放 import 變數）
  const [collected, setCollected] = useState([]);
  const [collectIndex, setCollectIndex] = useState(0);

  // 爪子回到原位時才顯示結果
  const handleClawUp = () => {
    const idx = Math.floor(Math.random() * prizeImgs.length);
    const prize = prizeImgs[idx];
    setResultImg(prize);
    setShowResult(true);
    setPendingResult(false);
    // 收藏邏輯
    const collectImg = prizeToCollect[prize.src];
    if (collectImg) {
      setCollected(prev => {
        if (prev.find(img => img.src === collectImg.src)) {
          // 已經有了，不動 collectIndex
          return prev;
        }
        // 新增時才切到新圖
        setCollectIndex(prev.length);
        return [...prev, collectImg];
      });
    }
  };

  // 點擊確定按鈕回到遊戲
  const handleConfirm = () => {
    setShowResult(false);
    setResultImg(null);
    setPendingResult(false);
    setIsClawDown(false);
  };

  // 切換音樂播放/暫停
  const handleMusicClick = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full h-screen">
      {/* 左上角 info 與 music 按鈕 */}
      <div className="absolute top-4 left-4 z-50 flex flex-row gap-2 items-center">
        <button
          onClick={() => setShowInfo((prev) => !prev)}
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <Image src={IBtnImg} alt="info-btn" width={56} height={56} />
        </button>
        <button
          style={{ background: 'none', border: 'none', padding: 0 }}
          onClick={handleMusicClick}
        >
          <Image src={MusicImg} alt="music-btn" width={56} height={56} />
        </button>
        {/* 隱藏 audio 標籤 */}
        <audio ref={audioRef} src="/Bubblegum.mp3" loop />
      </div>
      {/* info 圖片顯示 */}
      {showInfo && (
        <div className="absolute top-20 left-4 z-5 p-2">
          <Image src={InfoImg} alt="info" width={260} height={260} />
        </div>
      )}
      {/* 中獎畫面 */}
      {showResult && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80">
          <Image src={resultImg} alt="result" width={400} height={400} />
          <button onClick={handleConfirm} className="mt-6">
            <Image src={BtnImg} alt="confirm" width={120} height={60} />
          </button>
        </div>
      )}
      {/* 收藏區顯示 */}
      <div className="absolute top-4 right-4 z-50 flex flex-col items-end">
        <div className="relative">
          <Image src={CollectImg} alt="collect" width={200} height={200} />
          {collected.length > 0 && collected[collectIndex] && (
            <div className="absolute inset-0 flex items-center justify-center  translate-y-4">
              <Image src={collected[collectIndex]} alt="collected" width={150} height={150} />
            </div>
          )}
          {collected.length > 1 && (
            <>
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 rounded-full px-2 py-1 text-xl"
                onClick={() => setCollectIndex((i) => (i - 1 + collected.length) % collected.length)}
                style={{zIndex: 10}}
              >
                &#8592;
              </button>
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 rounded-full px-2 py-1 text-xl"
                onClick={() => setCollectIndex((i) => (i + 1) % collected.length)}
                style={{zIndex: 10}}
              >
                &#8594;
              </button>
            </>
          )}
        </div>
      </div>
      {/* 遊戲畫面 */}
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        {
          !isHidden && <RoundedBox
            args={[1, 1, 1]}
            radius={0.05}
            smoothness={4}
            bevelSegments={4}
            creaseAngle={0.4}
          >
            <meshPhongMaterial color="#f3f3f3"/>
          </RoundedBox>
        }
        <Suspense fallback={null}>
          <ClawModel clawPos={clawPos} isClawDown={isClawDown} />
        </Suspense>
        <Environment
          background={true}
          backgroundBlurriness={0.5}
          backgroundIntensity={1}
          environmentIntensity={1}
          preset={'park'}
        /> 
        <ContactShadows opacity={1} scale={10} blur={10} far={10} resolution={256} color="#DDDDDD" />
        <KeyboardControls
          map={[
            { name: "forward", keys: ["ArrowUp", "w", "W"] },
            { name: "backward", keys: ["ArrowDown", "s", "S"] },
            { name: "left", keys: ["ArrowLeft", "a", "A"] },
            { name: "right", keys: ["ArrowRight", "d", "D"] },
            { name: "jump", keys: ["Space"] },
          ]}
        >
          <ClawCamera 
            clawPos={clawPos} 
            setClawPos={setClawPos} 
            isClawDown={isClawDown} 
            setIsClawDown={setIsClawDown} 
            onClawUp={handleClawUp}
            setPendingResult={setPendingResult}
            showResult={showResult}
            pendingResult={pendingResult}
          />
        </KeyboardControls>
        <CameraControls />
      </Canvas>
    </div>
  );
}
