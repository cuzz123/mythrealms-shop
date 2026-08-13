"""Score visible mannequin silhouette only; not hidden rig/weight equivalence."""
from pathlib import Path
import sys
import cv2
import numpy as np

root=Path(__file__).resolve().parent
ref=cv2.imread(r"C:\Users\11458\.codex\attachments\90349baa-907d-418b-ad34-a367b932ecf8\image-1.png")
# The current continuous-shell build is the default; a preview path may be
# supplied to compare its front/side/match view without overwriting earlier
# model evidence.
render_path=Path(sys.argv[1]) if len(sys.argv)>1 else root/'Preview_v9_match.png'
render=cv2.imread(str(render_path),cv2.IMREAD_UNCHANGED)
if render is None:
    raise FileNotFoundError(render_path)
# right-hand mannequin zone; HSV mask removes the grey grid and UI.
roi=ref[170:780,430:970];hsv=cv2.cvtColor(roi,cv2.COLOR_BGR2HSV)
target=cv2.inRange(hsv,(115,25,90),(175,190,255))
target[:120]=0  # exclude the lavender “角色1” viewport label above the mannequin
# The ROI already starts below the viewport label.  Restore the full silhouette
# so the reference head and shoulder line participate in the measurement.
target=cv2.inRange(hsv,(115,25,90),(175,190,255))
alpha=render[:,:,3] if render.shape[2]==4 else cv2.cvtColor(render,cv2.COLOR_BGR2GRAY)
def normalise(mask):
 ys,xs=np.where(mask>0); out=np.zeros((512,384),np.uint8)
 if len(xs)==0:return out
 crop=mask[ys.min():ys.max()+1,xs.min():xs.max()+1]
 return cv2.resize(crop,(384,512),interpolation=cv2.INTER_NEAREST)
a,b=normalise(target),normalise(alpha)
inter=np.logical_and(a>0,b>0).sum();union=np.logical_or(a>0,b>0).sum();score=100*inter/max(union,1)
# Red is reference-only, green is render-only, white is their overlap.
debug = np.zeros((512,384,3),np.uint8)
debug[(a>0)&(b==0)] = (35,35,225)
debug[(a==0)&(b>0)] = (35,210,35)
debug[(a>0)&(b>0)] = (245,245,245)
cv2.imwrite(str(root/'similarity_overlay.png'),debug)
(root/'similarity_report.txt').write_text(f'preview={render_path.name}\nvisible_silhouette_iou_percent={score:.2f}\nmethod=masked_right_mannequin_silhouette_only\n',encoding='utf8')
print(f'Preview: {render_path.name}\nVisible silhouette IoU: {score:.2f}%')
