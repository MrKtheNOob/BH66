#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

from sewing_inference.pipeline import run_inference


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run local inference on one image")
    parser.add_argument("--image", required=True, help="Path to front image")
    parser.add_argument("--height", required=True, type=float, help="User height in cm")
    parser.add_argument("--side-image", default=None, help="Optional side image path")
    parser.add_argument("--out", default=None, help="Output JSON path")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    output = run_inference(image_path=args.image, height_cm=args.height, side_image_path=args.side_image)

    payload = output.to_dict()
    if args.out:
        out_path = Path(args.out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        print(f"Wrote inference output to {out_path}")
    else:
        print(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
