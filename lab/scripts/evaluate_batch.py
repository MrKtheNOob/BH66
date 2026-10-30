#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

from sewing_inference.pipeline import run_inference


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Evaluate a CSV batch of samples")
    parser.add_argument("--input-csv", required=True, help="CSV with image_path,height_cm")
    parser.add_argument("--out-dir", required=True, help="Directory for per-sample JSON outputs")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    total = 0
    valid = 0
    rejected = 0

    with open(args.input_csv, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        required_cols = {"image_path", "height_cm"}
        missing = required_cols - set(reader.fieldnames or [])
        if missing:
            raise ValueError(f"CSV missing columns: {sorted(missing)}")

        for row in reader:
            total += 1
            image_path = row["image_path"]
            height_cm = float(row["height_cm"])
            result = run_inference(image_path=image_path, height_cm=height_cm)

            if result.validation.valid:
                valid += 1
            else:
                rejected += 1

            out_file = out_dir / f"sample_{total:04d}.json"
            out_file.write_text(json.dumps(result.to_dict(), indent=2), encoding="utf-8")

    print(f"Total: {total}")
    print(f"Valid: {valid}")
    print(f"Rejected: {rejected}")
    print(f"Acceptance rate: {(valid / total * 100 if total else 0):.2f}%")


if __name__ == "__main__":
    main()
