# Dreamina 5-Character Remake Prompt Pack

Source reference video:

`D:\Chrome_Download\v03c76g10004d97q32qljht2pve1.750.mp4`

Character references:

- `D:\Chrome_Download\角色1.jpg` - pale sage green gown, blonde woman, soft ethereal elegance.
- `D:\Chrome_Download\角色2.jpg` - ivory sheer gown, blonde woman with round glasses and pearl chains.
- `D:\Chrome_Download\角色3.jpg` - black velvet dress with champagne drape, brunette woman, intense editorial look.
- `D:\Chrome_Download\角色4.jpg` - champagne gold satin dress, brunette woman, warm luxury presence.
- `D:\Chrome_Download\角色5.jpg` - navy tulle gown, blonde woman, pearl butterfly necklace, lead heroine energy.

## Recommended Dreamina Mode

Use Dreamina web:

- Mode: all-around reference / multimodal reference / multi-image reference.
- Upload all five character images as character references.
- Ask for strong character consistency: preserve each woman's face, hair, dress color, jewelry, and silhouette.
- Output: 16:9, 720p or 1080p, 15 seconds.
- Motion: medium-low.
- Style: cinematic fashion crime trailer.

## Full Video Prompt

```text
Create a 15-second cinematic luxury fashion crime trailer in an underground parking garage at night. Use the five uploaded reference women as five distinct characters, preserving each woman's face, hairstyle, dress color, jewelry, and silhouette exactly from the reference images.

Scene setting: a cold blue-gray underground parking garage, glossy concrete floor, fluorescent ceiling lights, a black luxury car with bright headlights, faint mist, high contrast film lighting, shallow depth of field, reflective surfaces.

Character arrangement:
Character 5 in the navy tulle gown and pearl butterfly necklace is the lead heroine standing beside the black luxury car.
Character 2 in the ivory sheer gown with round glasses and pearl chains is the strategist, shown in intense close-up like a calm mastermind.
Character 3 in the black velvet dress with champagne drape has a powerful guard-like presence, holding a polished chrome cane or baton in an elegant fashion pose.
Character 4 in the champagne gold satin dress is the central luxury queen, seated on the front of the car with confident posture.
Character 1 in the pale sage green gown stands at the far side as an ethereal silent guard.

Camera language: slow dolly push-in, dramatic close-ups, over-the-shoulder reveal, smooth orbit, final wide group shot. Keep the mood elegant, dangerous, quiet, luxurious, and cinematic. No fighting, no gore, no text, no subtitles, no logo.
```

## Negative Prompt

```text
low quality, blurry face, face swap artifacts, inconsistent identity, changing dress color, changing hairstyle, deformed hands, extra fingers, distorted jewelry, broken glasses, duplicated face, extra people, male characters, cartoon, anime, overexposed, messy parking garage, warped car, text, logo, watermark, subtitles, violence, blood
```

## Segment Prompts

Generate as 5 clips if full 15-second generation is unstable. Each clip should be 3 seconds, 16:9, same setting, same references.

### Clip 01 - Lead Heroine Reveal

Use `角色5.jpg` as the main character reference.

```text
Character 5, the blonde woman in the navy tulle gown with the pearl butterfly necklace, stands beside a black luxury car in a cold blue-gray underground parking garage. She slowly turns from a side pose toward camera, calm and powerful. Fluorescent ceiling lights reflect on the car, faint mist in the background, cinematic luxury crime trailer, slow dolly push-in, shallow depth of field, preserve her exact face, blonde updo, navy dress, pearl necklace, no text.
```

### Clip 02 - Strategist Close-Up

Use `角色2.jpg` as the main character reference.

```text
Cut to an intense close-up of Character 2, the blonde woman in an ivory sheer gown wearing round glasses with pearl chains. She looks directly into camera with a calm mastermind expression. Cold parking garage lights reflect in her glasses, black luxury car blurred behind her, elegant pearl details moving subtly, cinematic close-up, slow push-in, preserve her exact face, glasses, hairstyle, ivory gown, and pearl chains, no text.
```

### Clip 03 - Elegant Guard Motion

Use `角色3.jpg` as the main character reference.

```text
Character 3, the brunette woman in the black velvet dress with champagne drape and pearl earrings, steps into frame beside the luxury car. She raises a polished chrome cane or baton in a refined fashion pose, not violent, like an elegant bodyguard. Cold blue garage lighting, glossy floor reflections, slow lateral camera move, serious editorial expression, preserve her exact face, curly updo, black and champagne dress, earrings, no text.
```

### Clip 04 - Golden Queen Reveal

Use `角色4.jpg` as the main character reference.

```text
Character 4, the brunette woman in the champagne gold satin dress with pearl earrings, is revealed seated confidently on the front of the black luxury car. The headlights glow behind her, the camera tilts up from the car grille to her calm face. She looks like a luxury queen in a fashion crime trailer, warm gold fabric contrasting with cold blue parking garage lights, preserve her exact face, updo, gold dress, jewelry, no text.
```

### Clip 05 - Final Five-Woman Group Shot

Use all five references.

```text
Final wide group shot: all five reference women stand around the black luxury car in the underground parking garage. Character 4 in the gold dress sits or stands at the center near the car hood, Character 5 in navy stands to one side as the lead heroine, Character 2 in ivory with glasses stands composed and intelligent, Character 3 in black velvet holds a chrome cane or baton elegantly, Character 1 in pale sage green stands at the far side with ethereal calm. Symmetrical fashion editorial composition, bright car headlights, cold blue-gray cinematic lighting, slow camera pull-back, preserve every woman's distinct face, hairstyle, dress color, and jewelry, no text.
```

## Editing Notes

- If Dreamina changes outfits too much, regenerate each clip using only the main character reference plus the full prompt context.
- If identities drift in the final group shot, create the group shot as an image first, then use image-to-video with subtle camera pull-back.
- Keep motion gentle. Strong motion tends to damage jewelry, glasses, hands, and dress consistency.
- For a cleaner remake of the source video, generate clips separately and assemble them in Jianying/CapCut with hard cuts at 3-second intervals.
