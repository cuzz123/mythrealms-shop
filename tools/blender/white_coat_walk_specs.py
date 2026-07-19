from __future__ import annotations


CHARACTER_ID = "CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001"
RIG_NAME = "RIG_WHITE_COAT_FULLBODY"
MOTION_CATALOG_ID = "8f81454a-f6f3-4f20-8e50-67418c530001"
CAMERA_CATALOG_ID = "8f81454a-f6f3-4f20-8e50-67418c530002"
FRAMES = 96
FPS = 24


WALKS = [
    {
        "index": 1,
        "action_id": "ACT_WHITE_COAT_RUNWAY_WALK_01",
        "name_zh": "白色长外套·正面台步",
        "camera_id": "CAM_WHITE_COAT_RUNWAY_DOLLY_01",
        "camera_name_zh": "正面全身·同步后移",
        "camera_style": "front_dolly",
        "frames": FRAMES,
        "fps": FPS,
        "distance_height": 0.46,
        "planted_intervals": {"L": [(1, 12), (49, 60)], "R": [(25, 36), (73, 84)]},
        "status": "candidate",
    },
    {
        "index": 2,
        "action_id": "ACT_WHITE_COAT_WALK_IN_STOP_01",
        "name_zh": "白色长外套·走入停下",
        "camera_id": "CAM_WHITE_COAT_WALK_IN_STOP_01",
        "camera_name_zh": "正面全身·落点定格",
        "camera_style": "walk_in_stop",
        "frames": FRAMES,
        "fps": FPS,
        "distance_height": 0.36,
        "planted_intervals": {"L": [(1, 14), (49, 64)], "R": [(25, 40), (73, 96)]},
        "status": "candidate",
    },
    {
        "index": 3,
        "action_id": "ACT_WHITE_COAT_TRACKING_PASS_01",
        "name_zh": "白色长外套·三分侧跟行",
        "camera_id": "CAM_WHITE_COAT_TRACKING_PASS_01",
        "camera_name_zh": "右前三分侧·平行跟拍",
        "camera_style": "three_quarter_track",
        "frames": FRAMES,
        "fps": FPS,
        "distance_height": 0.42,
        "planted_intervals": {"L": [(1, 12), (49, 60)], "R": [(25, 36), (73, 84)]},
        "status": "candidate",
    },
]
