# 🔧 Shell Integration Guide

## ما تم تفعيله

تم إعداد **Shell Integration** بشكل متقدم لتحسين تجربة السطر وكشف الأوامر في VS Code.

---

## 📁 الملفات المضافة

### 1. **PowerShell Profile** (الملف الأساسي)
```
📍 C:\Users\Reem\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
```

**المميزات:**
- ✅ Shell Integration مفعل
- ✅ PSReadLine محسّن مع IntelliSense
- ✅ Aliases مخصصة للبوت
- ✅ Prompt ملون وجميل
- ✅ أوامر سريعة للمشروع

### 2. **VS Code Settings**
```
📍 C:\Users\Reem\AppData\Roaming\Code\User\settings.json
```

**الإعدادات:**
- Shell Integration مفعل
- PowerShell 7 كـ default shell
- Command detection محسّن
- Terminal مخصص

### 3. **Keyboard Shortcuts**
```
📍 C:\Users\Reem\AppData\Roaming\Code\User\keybindings.json
```

**الاختصارات:**
- `Ctrl+Shift+B` - تشغيل البوت
- `Ctrl+Shift+D` - وضع التطوير
- `Ctrl+`` - فتح terminal جديد
- `Alt+1` - الانتقال لمجلد المشروع
- `Alt+2` - بدء البوت
- `Alt+3` - وضع التطوير
- `Alt+4` - فحص الصحة

### 4. **VS Code Tasks** (داخل المشروع)
```
📍 .vscode/tasks.json
```

**المهام المتاحة:**
- 🤖 Start Bot
- 🛠️ Dev Mode
- 📊 Health Check
- 📦 Install Dependencies
- 🧹 Clean & Reinstall
- 📝 Check Env File
- 🔄 Restart Bot

### 5. **Debugger Configuration**
```
📍 .vscode/launch.json
```

**الخيارات:**
- 🚀 Launch Bot
- 🔍 Debug Bot
- 🔗 Attach to Process

### 6. **Project Settings**
```
📍 .vscode/settings.json
```

**الإعدادات المحلية:**
- Terminal محسّن
- Shell Integration مفعل
- Extensions موصى بها

### 7. **Extensions Recommendations**
```
📍 .vscode/extensions.json
```

---

## 🚀 كيفية الاستخدام

### ✅ الطريقة 1: استخدام Keyboard Shortcuts

```bash
# فتح Terminal جديد
Ctrl + `

# تشغيل البوت
Ctrl + Shift + B    أو    Alt + 2

# وضع التطوير
Ctrl + Shift + D    أو    Alt + 3

# الانتقال للمشروع
Alt + 1

# فحص الصحة
Alt + 4
```

### ✅ الطريقة 2: استخدام Command Palette

```bash
# اضغط Ctrl+Shift+P وابحث عن:
Tasks: Run Task

# ستظهر المهام:
• 🤖 Start Bot
• 🛠️ Dev Mode
• 📊 Health Check
• And more...
```

### ✅ الطريقة 3: استخدام PowerShell Aliases

في Terminal، استخدم الأوامر المتاحة:

```bash
project    # الانتقال للمشروع
startbot   # بدء البوت
devbot     # وضع التطوير
botcheck   # فحص صحة البوت
recent     # آخر 20 أمر
cmdhelp    # مساعدة الأوامر
```

---

## 📊 ميزات Shell Integration

### 1️⃣ **Enhanced Command Detection**
- كشف تلقائي للأوامر المشهورة
- IntelliSense و autocomplete
- اقتراحات ذكية

### 2️⃣ **Command Palette Integration**
- تشغيل مهام مباشرة
- أوامر مخصصة سريعة
- History و search محسّن

### 3️⃣ **Terminal Decorations**
- إظهار علامات الأوامر
- رموز للألوان
- Breadcrumbs للنوافذ

### 4️⃣ **PowerShell Enhancements**
- PSReadLine محسّن
- Tab completion أفضل
- History search محسّن

### 5️⃣ **Project Awareness**
- Node modules detection
- Git branch display
- Smart prompts

---

## 🎨 Prompt Customization

الـ Prompt الجديد يعرض:
```
[HH:mm:ss] location [GIT] [NODE] ❯ 
```

**الألوان:**
- 🔴 Red: أخطاء
- 🟢 Green: نجاح
- 🔵 Cyan: المسار
- 🟡 Yellow: التحذيرات

---

## 🔧 تفعيل الميزات

### الميزة 1: Terminal Integration
```json
"terminal.integrated.shellIntegration.enabled": true
```

### الميزة 2: Command Decorations
```json
"terminal.integrated.shellIntegration.decorationsEnabled": "both"
```

### الميزة 3: Shell Arguments
```json
"terminal.integrated.shellArgs.windows": []
```

---

## 📚 الأوامر المتاحة في Terminal

### Navigation
```bash
project     # cd c:\Users\Reem\Desktop\بوت
..          # cd ..
```

### Bot Commands
```bash
startbot    # npm start
devbot      # npm run dev
botcheck    # Check environment
```

### General Commands
```bash
recent      # Show last 20 commands
cmdhelp     # Get command help
```

---

## 🔄 Restart & Reload

### إعادة تحميل PowerShell Profile
```bash
& $PROFILE
```

### إعادة تحميل VS Code
```bash
Ctrl + R (في VS Code)
```

### فتح Terminal جديد
```bash
Ctrl + `
```

---

## 🎯 Troubleshooting

### المشكلة: Aliases لا تعمل
**الحل:**
```bash
# أعد تحميل الـ profile
& $PROFILE

# أو ابدأ terminal جديد
```

### المشكلة: Shell Integration معطل
**الحل:**
```bash
# تحقق من الإعدادات
Settings > Terminal > Integrated > Shell Integration > Enabled
```

### المشكلة: PowerShell Version قديم
**الحل:**
```bash
# ثبت PowerShell 7
winget install Microsoft.PowerShell

# أو من:
https://github.com/PowerShell/PowerShell/releases
```

---

## 📌 نصائح مهمة

✅ **استخدم Keyboard Shortcuts دائماً** - أسرع وأسهل
✅ **أبقِ Terminal مفتوح** - للمراقبة المستمرة  
✅ **استخدم Command Palette** - Ctrl+Shift+P للبحث
✅ **راقب الـ Status Bar** - يعرض معلومات مفيدة

---

## 🎓 معلومات إضافية

- **PowerShell Profile**: ملف يحمل باستخدام PowerShell
- **Shell Integration**: ميزة VS Code لتحسين Terminal
- **Aliases**: أسماء مختصرة للأوامر
- **IntelliSense**: اقتراح تلقائي للأوامر

---

## ✨ الحالة الحالية

✅ **Shell Integration**: مفعل
✅ **PowerShell Profile**: جاهز
✅ **VS Code Integration**: متقدم
✅ **Keyboard Shortcuts**: مخصص
✅ **Tasks**: متوفرة

---

## 🚀 الخطوات التالية

1. ✅ أغلق وافتح VS Code من جديد
2. ✅ جرب الـ Aliases في Terminal
3. ✅ استخدم الاختصارات للأوامر السريعة
4. ✅ استمتع بتجربة محسّنة! 🎉

---

**تم التكوين**: فبراير 8، 2026
**الحالة**: 🟢 جاهز للاستخدام
