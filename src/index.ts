//делаем импорты
import * as BABYLON from 'babylonjs';
import * as ZapparBabylon from '@zappar/zappar-babylonjs';
import * as MAT from 'babylonjs-materials';
import target from '../assets/marker2.zpt';
import 'babylonjs-loaders';
import './index.sass';
import * as GUI from "@babylonjs/gui"
//проверяем поддержку пбраузера
if (ZapparBabylon.browserIncompatible()  == true) {ZapparBabylon.browserIncompatibleUI();throw new Error('БРАУЗЕР НЕ ПОДДЕРЖИВАЕТСЯ');}
let btn = document.getElementById("btn") 
const can = document.createElement('canvas');
document.body.appendChild(can);
const eng = new BABYLON.Engine(can, true);
const scene = new BABYLON.Scene(eng);
window.addEventListener('resize', () => {
  eng.resize();
});
const pointLight = new BABYLON.DirectionalLight('dir02', new BABYLON.Vector3(0, 0, -1), scene);
pointLight.position = new BABYLON.Vector3(0, 1, -10);
const shadowGenerator = new BABYLON.ShadowGenerator(1024, pointLight);
shadowGenerator.usePoissonSampling = true;
const cam = new ZapparBabylon.Camera('ZapparCamera', scene); 
ZapparBabylon.permissionRequestUI().then((granted) => {
  if (granted) cam.start();
  else ZapparBabylon.permissionDeniedUI();
});
const tracker = new ZapparBabylon.ImageTrackerLoader().load(target);
const trackTrans = new ZapparBabylon.ImageAnchorTransformNode('tracker', cam, tracker, scene);
trackTrans.setEnabled(false);tracker.onVisible.bind(() => {trackTrans.setEnabled(true);});
tracker.onNotVisible.bind(() => {trackTrans.setEnabled(false);});
const ground = BABYLON.MeshBuilder.CreatePlane('plane', { width: 0.1, height: 0.1 }, scene);
const shadowMaterial = new MAT.ShadowOnlyMaterial('mat', scene);
shadowMaterial.alpha = 0.5;
shadowMaterial.activeLight = pointLight;
ground.material = shadowMaterial;
ground.parent = trackTrans;
pointLight.parent = trackTrans;
ground.receiveShadows = true;
shadowGenerator.getShadowMap()?.renderList?.push(ground);
//список желаний
let texts = ["Желаем, чтобы ваши друзья всегда были с вами и могли поддержать в трудную минут","Чтобы в следующем году у вас было поменьше проблем и трудностей придумай ещё два","Чтобы в новом году все хотелось и моглось","Всего самого наилучшего"]
var plane_text = BABYLON.Mesh.CreatePlane("plane_phrase", 3, scene); 
plane_text.parent = ground;
plane_text.position.y = 0.5;
var advancedTexture2 = GUI.AdvancedDynamicTexture.CreateForMesh(plane_text as any);
var textBox = GUI.Button.CreateSimpleButton("but", texts[Math.floor(Math.random()*texts.length)]);
textBox.height = 0.3;
textBox.color = "#FFFFFF";
textBox.pointerEnterAnimation = () => null;
textBox.pointerOutAnimation = () => null;
textBox.pointerDownAnimation = () => null;
textBox.pointerUpAnimation = () => null;
textBox.fontSize = 60;
textBox.background = "#3300FF";
textBox.width = 0.8;
advancedTexture2.addControl(textBox)
document.addEventListener("DOMContentLoaded", () => {
  if ( btn != null){
    btn.onclick = function(){
      let anyText = textBox as any
      let index = Math.floor(Math.random()*texts.length)
      anyText.children[0].text = texts[index];
    }
  }
});
//запускаем бесконечный цикл приложения
eng.runRenderLoop(() => {
  cam.updateFrame();
  scene.render();
});