<div style="text-align:center" align="center">
	<img src="https://user-images.githubusercontent.com/44205667/146611227-a7c690ff-3569-4b5d-8bc4-1f30ea5949f9.png" width="200" height="200">
</div>

### Instalación
1. Clone el repositorio
`$ git clone https://github.com/MarioBasCo/Inventario.git`
2. Instale los paquetes NPM
`$ npm install `

###### Complementos Instalados
QR Scanner;
- `$ npm install phonegap-plugin-barcodescanner `
- `$ npm install @ionic-native/barcode-scanner `

Sqlite;
- `$ npm install cordova-sqlite-storage `
- `$ npm install @ionic-native/sqlite `

PDF y Manejo de Archivos;
- `$ npm install pdfmake --save `
- `$ npm uninstall @ionic-native/file `
- `$ npm install @ionic-native/file-opener `
- `$ npm install cordova-plugin-file-opener2 `
- `$ npm install @capacitor/filesystem `

Complementos Nativos de Ionic;
- `$ npm install @ionic-native/core --save `

Convertir dependencias de node_modules a AndroidX;
- `$ npm install jetifier `
- `$ npx jetify `

### Permisos en Android Manifest
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.app">
	<application
			...
			android:requestLegacyExternalStorage="true">
        	...
	</application>

	<!-- Permissions -->
	<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
</manifest>
```
