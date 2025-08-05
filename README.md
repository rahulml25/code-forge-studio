# CodeForge Studio

🎉 **COMPLETED AND FULLY FUNCTIONAL!** 

A full-stack visual UI designer that allows users to design interfaces via drag-and-drop and generates frontend code in real-time.

![CodeForge Studio](https://via.placeholder.com/800x400/3b82f6/ffffff?text=CodeForge+Studio)

## ✅ Status: PRODUCTION READY

✅ All major features implemented  
✅ Error-free build  
✅ Working drag & drop  
✅ Real-time code generation  
✅ Component library complete  
✅ Responsive design working  
✅ Demo content available

## ✨ Features

### Core Features

- **Visual Drag & Drop Editor**: Intuitive canvas for designing UI components
- **Real-time Code Generation**: Instant HTML/CSS, Tailwind, or React JSX output
- **Component Library**: Pre-built, reusable UI components
- **Responsive Design Tools**: Preview in desktop, tablet, and mobile views
- **Advanced Styling Controls**: Margin, padding, colors, fonts, shadows, and borders

### Advanced Features

- **AI-Powered UI Generation**: Natural language to UI conversion
- **Collaboration Support**: Multi-user real-time editing (foundation)
- **Undo/Redo System**: Full history management
- **Export Options**: Download code or export to GitHub
- **Keyboard Shortcuts**: Efficient workflow controls

### Component Library Includes

- **Layout**: Container, Flex Container, Grid Container
- **Text**: Text, Headings (H1-H6)
- **Interactive**: Buttons, Input Fields
- **Media**: Images
- **Content**: Cards, Lists

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd code-forge-studio
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Drag & Drop**: React DnD
- **Icons**: Lucide React
- **Code Highlighting**: Prism React Renderer
- **Layout**: React Resizable Panels
- **Build Tool**: Vite
- **Color Picker**: React Colorful

## 📖 Usage

### Basic Workflow

1. **Select Components**: Choose from the component library in the left sidebar
2. **Drag & Drop**: Drag components onto the canvas
3. **Customize**: Select components to edit properties in the right panel
4. **Generate Code**: View generated code in real-time in the code panel
5. **Export**: Download or copy the generated code

### Keyboard Shortcuts

- `Ctrl+Z`: Undo
- `Ctrl+Y`: Redo
- `Ctrl+S`: Save to history
- `Escape`: Deselect component
- `P`: Toggle between Design and Preview mode

### AI Assistant

1. Click the AI assistant button (purple bot icon)
2. Describe what you want to create in natural language
3. The AI will generate and add components to your canvas

Example prompts:

- "Add a login form with email and password fields"
- "Create a hero section with title and CTA button"
- "Add a navigation bar with logo and menu items"

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Canvas/          # Main design canvas
│   ├── CodePanel/       # Code generation display
│   ├── ComponentLibrary/# Available components
│   ├── Header/          # Top navigation bar
│   ├── PropertiesPanel/ # Component property editor
│   ├── Sidebar/         # Component library sidebar
│   └── ...
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── styles/              # CSS and styling
```

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript type checking

### Code Generation

The application supports three output formats:

1. **React JSX**: Complete React components with props and styling
2. **HTML/CSS**: Standard HTML with embedded or linked CSS
3. **Tailwind CSS**: HTML with Tailwind utility classes

### Adding New Components

1. Create component preview in `src/components/ComponentLibrary/index.tsx`
2. Add component definition to the `componentLibrary` array
3. Update type mappings in code generators
4. Add appropriate Tailwind class mappings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern React and TypeScript
- Inspired by visual design tools like Figma and Webflow
- Icons provided by Lucide React
- Component drag-and-drop powered by React DnD

## 🔮 Future Enhancements

- [ ] Voice commands for design control
- [ ] Real-time collaboration with WebSockets
- [ ] Advanced component nesting and layouts
- [ ] Custom component creation
- [ ] Theme system and design tokens
- [ ] Plugin architecture for extensibility
- [ ] Integration with popular design systems
- [ ] Advanced animations and transitions
- [ ] Component variants and states
- [ ] Design system documentation generation

## 📞 Support

For support, email [your-email] or open an issue on GitHub.

---

**CodeForge Studio** - Empowering designers and developers to create beautiful UIs visually! 🎨✨
