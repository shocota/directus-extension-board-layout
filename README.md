# directus-extension-board-layout

This repository is a layout extension for Directus, that allows you to display items in a Kanban-style layout.

## Video of the features (only Japanese Sub)

https://user-images.githubusercontent.com/92870471/212604984-0409b1d8-b636-4bcc-973b-d9d0c6269763.mov

## Installation

`npm install directus-extension-board-layout` on your directus Project Root folder.

or

Clone this repo, then run:

- `npm install`
- `npm run build`.
- `dist/index.js` is created by the build command
- place `index.js` in the `${DIRECTUS_PROJECT_ROOT_FOLDER}/extensions/layouts/board-layout/`

## Usage

- You must set a field interface to _dropdown_ to choose as a Group By option.
- Your collection must use the optional system field named `sort` (integer)
  - you need to set your collection to be sorted by the `sort` field

# License

This repository is licensed under the GPLv3 License. See the LICENSE file for details.

# Additional information

If you have any questions or issues, please feel free to open an issue or submit a pull request.
