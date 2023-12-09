import { Injectable } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({ providedIn: 'root' })
export class PdfService {

    public createPdf(pdfTitle: string, content: any[]): void {
        const docDefinition = {
            styles: {
                header: {
                    bold: true,
                    fontSize: 15
                }
            },
            defaultStyle: {
                fontSize: 12
            },
            content,
        }

        pdfMake.createPdf(JSON.parse(JSON.stringify(docDefinition))).download(`${pdfTitle}.pdf`)
    }
}
