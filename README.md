
## 📋 Requirements

- Visual Studio Code version 1.85.0 or higher
- No additional dependencies required for users

## 🐛 Known Issues

- Real-time transliteration may have a slight delay on very large files
- Custom file extensions (`.san`, `.sanskrit`) require explicit language mode selection in some cases

## 🗺️ Roadmap

- [ ] Add support for Baraha schemes
- [ ] Configuration options for auto-transliteration toggle
- [ ] Support for bidirectional transliteration (Devanagari to Harvard-Kyoto)
- ...

## 📝 Version History

### Version 0.1.0 (Initial Release)
- ✅ Manual transliteration command
- ✅ Support for `.txt`, `.md`, `.san`, `.sanskrit` files
- ✅ Keyboard shortcut (`Ctrl+Shift+S`)
- ✅ Status bar indicator
- ✅ Performance-optimized 

### Version 0.1.9 (missed version change)

- ✅ Real-time Harvard-Kyoto to Devanagari transliteration
- ✅ Auto translation when any of the character is typed - ['\n' , . ,  ; ! ? |]  
- ✅ IAST and ITRANS

### Version 0.1.10 (added context menu)
- Added Context menu to convert the romanized text written in Harvard-Kyoto (HK) transliteration scheme  into sanscrit using the Selected text -> right click -> Sanskrit: Transliterate Selection 
-shortcut keys  (Windows: <ctrl><shift>S, Mac:<cmd><Shift>S) also transliterates the selected text

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/<AmazingFeature>`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/<AmazingFeature>`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [@indic-transliteration/sanscript](https://www.npmjs.com/package/@indic-transliteration/sanscript) library
- Harvard-Kyoto transliteration scheme documentation
- VS Code Extension API

## 📧 Contact

Ramaseshan Ramachandran(Ramaseshanr at gmail.com)

Project Link: [https://github.com/jarlabz/sanskriber](https://github.com/jcrlabz/sanskriber)

## 💡 Support

If you find this extension useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting issues
- 📝 Contributing improvements
- 📢 Sharing with others interested in Sanskrit

---

**Made with ❤️ for Sanskrit enthusiasts and scholars**
