# Jan Sahayak Pro iOS

Native SwiftUI starter app for the Jan Sahayak Pro admin workspace.

## What is included

- Native iPhone/iPad SwiftUI app structure
- Local JSON persistence for cases, activities, plans, finance entries, and reports
- Official case-type catalogs for Supreme Court of India, Patna High Court, and Bihar district/eCourts
- Case registration with document upload metadata
- Activity Planning pipeline with offline-generated concept note, agenda, checklist, report template, and follow-up copy
- Report builder with uploaded supporting documents
- Finance tracker

## Project layout

- `project.yml`: XcodeGen project spec
- `Sources/`: SwiftUI app source
- `scripts/generate_project.sh`: helper to generate the `.xcodeproj`

## To open in Xcode

1. Install full Xcode.
2. Install XcodeGen if it is not already available:
   `brew install xcodegen`
3. From this folder run:
   `./scripts/generate_project.sh`
4. Open `JanSahayakPro.xcodeproj` in Xcode.
5. Build and run on an iPhone simulator.

## Notes

- This native app is self-contained and uses local persistence first.
- The web workspace's protected AI route is not reused directly here. The Activity Pipeline and reporting flows currently generate strong structured drafts locally so the app stays usable offline.
- If you want, the next step can be Clerk auth plus a mobile-safe API layer that connects this app to the existing Next backend.
