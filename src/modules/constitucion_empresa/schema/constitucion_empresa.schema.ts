import { DatosPersonales } from "../interface/datos_personales.interface";
import { DatosSocio } from "../interface/datos_socio.interface";
import { DatosBienes } from "../interface/datos_bienes.interface";
import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ConstitucionEmpresaDocument = HydratedDocument<ConstitucionEmpresa>;

@Schema({
    timestamps: true,
    collection: 'constitucion_empresa',
})

export class ConstitucionEmpresa {
    @Prop({ required: true })
    tipoConstitucion: string;

    @Prop({ required: true })
    idUsuario: string;

    @Prop({ required: true, type: [String] })
    nombresEmpresa: string[];

    @Prop({ required: true })
    tipoSociedad: string;

    @Prop({ required: true, type: [String] })
    actividadesEmpresa: string[];

    @Prop()
    descripcionEmpresa: string;

    @Prop({ required: true })
    socios: DatosSocio[];

    @Prop({ required: true })
    capitalSocial: number;

    @Prop({ required: true })
    tipoAportacion: string;

    @Prop()
    cantidadEfectivo: number;

    @Prop()
    cantidadBienes: number;

    @Prop({ required: true })
    representanteLegal: DatosPersonales[];

    @Prop()
    aporteEfectivo: number;

    @Prop()
    aporteBienes: number;

    @Prop()
    Bienes: DatosBienes[];

    @Prop({ required: true })
    correoEmpresa: string;

    @Prop({ required: true })
    telefonoEmpresa: string;

    @Prop({ required: true })
    direccionEmpresa: string;

    @Prop({ required: true })
    tipoDomicilio: string;

    @Prop({ required: true })
    tipoRegimen: string;

    @Prop()
    numeroProceso: number;
}

export const ConstitucionEmpresaSchema = SchemaFactory.createForClass(ConstitucionEmpresa);