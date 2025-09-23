const {ipcMain,BrowserWindow} = require('electron')
const {Empresa} = require('../models/empresa')
const {DataRegimenFacturacion} = require('../models/dataRegimenFacturacion')
const bwipjs = require("bwip-js");

const  fs = require('fs');
const path = require('path');



ipcMain.handle('factura:generarFactura', async (event, data) => {

    try {
 
        const {
            cliente,
            detalles,
            headerFactura,
            exentoTotal,
            exoneradoTotal,
            gravado15Total,
            gravado18Total,
            isv15Total,
            isv18Total,
            transporteTotal,
            totalFactura
        } = data;

        const empresa = await Empresa.findOne();

        if (!empresa) {
            return { success: false, message: 'Empresa no encontrada' }
        }

        const cai = await DataRegimenFacturacion.findOne(
            {
                where: {
                    estado: 'activo'
                }
            }
        );

        const cantidadTotalArticulos = detalles.reduce((total, detalle) => total + detalle.Cantidad, 0).toFixed(2);

        const templatePath = path.join(__dirname, '..', 'plantillaFactura', 'FacturaAnaloga.html');
        const template = fs.readFileSync(templatePath, 'utf-8');

       const filasDetalles = detalles.map(detalle => {

            return `<tr>
                <td>${detalle.Cantidad}</td>
                <td>${detalle.CodigoArticulo}</td>
                <td>${detalle.Descripcion}</td>
                <td>${separadorMilesDecimales(detalle.PrecioUnitario)}</td>
                <td>${separadorMilesDecimales(detalle.Descuento)}</td>
                <td>${separadorMilesDecimales(detalle.Importe)}</td>
            </tr>`;
        }).join('');


        let logoBase64 = '';
            try {
                const logoBuffer = fs.readFileSync(empresa.logo);
                logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
            } catch (err) {
                console.error('Error leyendo el logo:', err);
        }

        const contadoMark = headerFactura.terminoVenta !== 0 ? 'X' : '';
        const creditoMark = headerFactura.terminoVenta === 0 ? 'X' : '';

        const fechaLimite = formatoFechaLiteral(cai.fechaLimiteEmision);
        const monto_letras = convertirNumeroALetras(totalFactura);
        const codigoBarraSVG = await generarBarCode(headerFactura.facturaSap);
        console.log('codigoBarraSVG:', codigoBarraSVG);

        const logosHTML = `
            <img src="${logoToBase64(path.join(__dirname, '..', 'logos', 'mabe.webp'))}" alt="Logo Mabe">
            <img src="${logoToBase64(path.join(__dirname, '..', 'logos', 'haier.webp'))}" alt="Logo Haier">
            <img src="${logoToBase64(path.join(__dirname, '..', 'logos', 'cetron.webp'))}" alt="Logo Cetron">
            <img src="${logoToBase64(path.join(__dirname, '..', 'logos', 'ge.png'))}" alt="Logo GE" style="width: 40px !important;">
            `;


        const html = template
            .replace(/{{empresa.razonSocial}}/g, empresa.razonSocial)
            .replace(/{{empresa.correo}}/g, empresa.correo)
            .replace(/{{empresa.direccion}}/g, empresa.direccion)
            .replace(/{{empresa.telefono}}/g, empresa.telefono)
            .replace(/{{empresa.logo}}/g, logoBase64)
            .replace(/{{empresa.rtn}}/g, empresa.rtn)

            .replace(/{{cai.cai}}/g, cai.cai)
            .replace(/{{cai.rangoAutorizado}}/g, cai.rangoAutorizado)
            .replace(/{{cai.fechaLimiteEmision}}/g, fechaLimite)
            .replace(/{{cai.folioInicial}}/g, cai.folioInicial)
            .replace(/{{cai.folioFinal}}/g, cai.folioFinal)
            .replace(/{{cai.mascaraFolio}}/g, cai.mascaraFolio)

            .replace(/{{cliente.razonSocial}}/g, cliente.razonSocial)
            .replace(/{{cliente.direccion}}/g, cliente.direccion)
            .replace(/{{cliente.rtn}}/g, cliente.rtn)

            .replace(/{{headerFactura.fechaEmision}}/g, headerFactura.fechaEmision)
            .replace(/{{headerFactura.correlativo}}/g, headerFactura.correlativo)
            .replace(/{{headerFactura.poCliente}}/g, headerFactura.poCliente)
            .replace(/{{headerFactura.ordenVenta}}/g, headerFactura.ordenVenta)
            .replace(/{{headerFactura.terminoVenta}}/g, headerFactura.terminoVenta)
            .replace(/{{headerFactura.terminoPago}}/g, headerFactura.terminoPago)

            .replace(/{{\s*exoneradoTotal\s*}}/g,separadorMilesDecimales(exoneradoTotal))
            .replace(/{{\s*exentoTotal\s*}}/g,separadorMilesDecimales(exentoTotal))
            .replace(/{{\s*gravado15Total\s*}}/g,separadorMilesDecimales(gravado15Total))
            .replace(/{{\s*gravado18Total\s*}}/g,separadorMilesDecimales(gravado18Total))
            .replace(/{{\s*isv15Total\s*}}/g,separadorMilesDecimales(isv15Total))
            .replace(/{{\s*isv18Total\s*}}/g,separadorMilesDecimales(isv18Total))
            .replace(/{{\s*transporteTotal\s*}}/g,separadorMilesDecimales(transporteTotal))
            .replace(/{{\s*totalFactura\s*}}/g,separadorMilesDecimales(totalFactura))
            .replace(/{{\s*detalles\s*}}/g, filasDetalles)
            
            .replace(/{{contadoMark}}/g, contadoMark)
            .replace(/{{creditoMark}}/g, creditoMark)
            .replace(/{{\s*cantidadTotalArticulos\s*}}/g, cantidadTotalArticulos)
            .replace(/{{monto_letras}}/g, monto_letras)
            .replace(/{{logosHTML}}/g, logosHTML)
            .replace(/{{headerFactura.facturaSap}}/g, headerFactura.facturaSap)
            .replace(/{{headerFactura.pesoNeto}}/g, headerFactura.pesoNeto)
            .replace(/{{headerFactura.pesoBruto}}/g, headerFactura.pesoBruto)
            .replace(/{{codigoBarraSVG}}/g, codigoBarraSVG)
            ;

        const browserWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },

            

        });

        browserWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
       // browserWindow.webContents.openDevTools();

        return { success: true, message: 'Factura creada exitosamente' }


    } catch (error) {
        console.error('Error al crear registro:', error)
        return { success: false, message: error.message || 'Error desconocido' }
    }
})

function formatoFechaLiteral(fechaString) {
    const meses = [
        "ENERO", "FEBRERO", "MARZO", "ABRIL",
        "MAYO", "JUNIO", "JULIO", "AGOSTO",
        "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
    ];

    const fecha = new Date(fechaString);
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();

    return `${dia} DE ${mes} DEL ${anio}`;
}

function separadorMilesDecimales(valor){
    const conversion =new Intl.NumberFormat(
        'es-HN', 
        { style: 'decimal',
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 }
    ).format(valor);
    return conversion
}

function convertirNumeroALetras(num) {
  if (num === null || num === undefined || !isFinite(num)) return '';
  const negativo = num < 0;
  if (negativo) num = Math.abs(num);

  const unidades = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
  const especiales = {
    10: "DIEZ", 11: "ONCE", 12: "DOCE", 13: "TRECE", 14: "CATORCE", 15: "QUINCE",
    16: "DIECISEIS", 17: "DIECISIETE", 18: "DIECIOCHO", 19: "DIECINUEVE"
  };
  const decenas = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
  const centenas = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

  function convertir(n) {
    n = Math.floor(n);
    if (n === 0) return "CERO";
    if (n < 10) return unidades[n];
    if (n < 20) return especiales[n] || ("DIEZ Y " + unidades[n - 10]);
    if (n < 100) {
      const t = Math.floor(n / 10);
      const u = n % 10;
      if (t === 2) { // 20..29 -> VEINTE, VEINTIUNO...
        return u === 0 ? "VEINTE" : ("VEINTI" + unidades[u]);
      }
      return decenas[t] + (u !== 0 ? " Y " + unidades[u] : "");
    }
    if (n === 100) return "CIEN";
    if (n < 1000) {
      const c = Math.floor(n / 100);
      const resto = n % 100;
      return centenas[c] + (resto !== 0 ? " " + convertir(resto) : "");
    }
    if (n < 1000000) {
      const miles = Math.floor(n / 1000);
      const resto = n % 1000;
      const pref = miles === 1 ? "MIL" : convertir(miles) + " MIL";
      return pref + (resto !== 0 ? " " + convertir(resto) : "");
    }
    // millones (soporte básico)
    if (n < 1000000000000) {
      const millones = Math.floor(n / 1000000);
      const resto = n % 1000000;
      const pref = millones === 1 ? "UN MILLON" : convertir(millones) + " MILLONES";
      return pref + (resto !== 0 ? " " + convertir(resto) : "");
    }
    return "NÚMERO MUY GRANDE";
  }

  let entero = Math.floor(num);
  let decimales = Math.round((num - entero) * 100);

  // Manejo cuando el redondeo de decimales produce 100
  if (decimales === 100) {
    entero += 1;
    decimales = 0;
  }

  const textoEntero = convertir(entero);
  const textoCentavos = decimales > 0 ? (" CON " + convertir(decimales) + " CENTAVOS") : "";

  return (negativo ? "MENOS " : "") + textoEntero + " LEMPIRAS" + textoCentavos;
}


function logoToBase64(pathLogo) {
  try {
    const buffer = fs.readFileSync(pathLogo);
    const ext = path.extname(pathLogo).slice(1); // e.g. 'webp' or 'png'
    return `data:image/${ext};base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.error(`Error leyendo ${pathLogo}:`, err);
    return '';
  }
}


async function generarBarCode(facturaSap) {
  const stringBarCode = `FACN-2005-${facturaSap}-2005`;

  try {
    const png = await bwipjs.toBuffer({
      bcid: 'code128',      
      text: stringBarCode,   
      scale: 10,             
      height: 12,          
      includetext: true, 
    });
    const base64 = `data:image/png;base64,${png.toString('base64')}`;
    return `<img src="${base64}" alt="Código de barras"/>`;

  } catch (err) {
    console.error('Error al generar código de barras:', err);
    return '';
  }
}
