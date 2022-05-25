const dataList = {
    departamentos: [
        "Call Center",
        "Call Center Sala de Ventas Cazzar",
        "Call Center Costa La Gloria",
        "Call Center Costa 1",
        "Call Center Costa 1A",
        "Call Center Costa 2",
        "Call Center Costa 3",
        "Call Center Ensenada",
        "Call Center Costa 1 Puerto Nuevo",
        "Unidad de Venta",
        "Ventas",
        "Cobranza"
    ],
    coords: [
        'Carlos Lenin',
        'Coord. Claudia Noriega',
        'Coord. Gabriela Cano',
        'Coord. Edgar Trejo',
        'Coord. Mariana Fragoso',
        'Aux. Yulissa Orozco',
        'Aux. Adolfo Martinez',
        'Aux. Alejandro Cazorla',
        'Aux. Ashram Mendez',
        'Aux. Bernardo Tovar',
        'Aux. Ezequiel Espinoza',
        'Aux. Ana Lizeth Lopez',
        'Aux. Kristina Voronina',
        'Aux. Alejandra Garcia',
        'Aux. Damaris Lopez',
        'Aux. Jared Mendez',
        'Aux. Isabel Aguilar',
        'Aux. Sabrina Martinez',
        'Aux. Gabriel Hidalgo',
        'Aux. Arturo Ubiedo',
        'Aux. Nayeli Juarez',
        'Aux. Vanessa Parra',
        'Aux. Veronica Gonzalez',
        'Aux. Victoria Martin',
        'Aux. Jesica Garcia',
        'Coord. Carlos Merlo',
        'Evaristo Lizarraga',
        'Diana Hernandez',
        'Elizabeth Portillo',
        'Coord. Gabriela Solano',
        'Elizabeth Portillo y/o Gabriela Solano',
        'Elizabeth Portillo y/o Ana Lizeth Lopez',
        'Elizabeth Portillo y/o Carlos Maldonado',
        'Coordinador Prueba',
        'Coord. Fernanda Peralta',
    ],
    fuentesCliente: [
        'Aviso',
        'Llamada no solicitada',
        'Recomendación de empleado',
        'Recomendación externa',
        'Tienda en línea',
        'Socio',
        'Facebook',
        'Twitter',
        'Relaciones públicas',
        'Alias del correo electrónico de ventas',
        'Google+',
        'Socio de seminarios',
        'Seminario interno',
        'Exposición comercial',
        'Descargar web',
        'Investigación web',
        'Casos de la Web',
        'Correo web',
        'Chat',
        'Infomercial',
        'Página Web',
        'Carteleras',
        'Periodico',
        'Radio',
        'Volanteo',
        'Oficinas',
        'Referido Inverplus',
        'Recomendados',
        'Flyers',
        'Camion',
        'Google AdWords',
        'CARRERA ROSARITO ABRIL 2022',
        'CARRETA PLAZA LAS AMERICAS',
        'CARTELERA SENTRI',
        'CONTENEDOR ALAMAR 3',
        'DESARROLLO LOS OLIVOS',
        'DESARROLLO RANCHO ESCONDIDO',
        'ENTREVISTA INVASORA USA',
        'EVENTO LIBERTEX 2022',
        'EXPO BODA 2022',
        'FACEBOOK CAMPESTRE VALLECITOS',
        'FACEBOOK CIELO',
        'FACEBOOK ENCINO SOLO',
        'FACEBOOK MISION DE GUADALUPE',
        'FACEBOOK RANCHETTES',
        'FACEBOOK RANCHO LAS PUERTAS',
        'FACEBOOK RESIDENCIAL LOS OLIVOS',
        'FACEBOOK VISTA DE PUERTO NUEVO',
        'GIGANTOGRAFIA COSTA DORADA',
        'GRUPO CADENA',
        'LANDING PAGE CIELO',
        'LANDING PAGE COSTA DORADA',
        'LANDING PAGE SAHARA',
        'LANDING PAGE TERRENOS CAMPESTRES',
        'OFICINA LAS AMERICAS',
        'PANTALLA ALAMEDA',
        'PASE CALL CENTER LA GLORIA',
        'PISTA DE HIELO 2021',
        'PROSPECCION AMBULANTE ROSARITO',
        'ZONKEYS 2022',
        'CAMION TOSCANA',
        'CARTELERA AGUAJE DE LA TUNA',
        'CARTELERA ALAMAR',
        'CARTELERA ALAMAR 2',
        'CARTELERA ALAMAR 3',
        'CARTELERA AVENIDA INTERNACIONAL',
        'CARTELERA CARRETERA ROSARITO ENSENADA',
        'CARTELERA CAZZAR',
        'CARTELERA CENTRO CIVICO ROSARITO',
        'CARTELERA CENTRO HISTORICO TKT',
        'CARTELERA CHARLYS',
        'CARTELERA CIELO',
        'CARTELERA CORPORATIVO DEL PRADO',
        'CARTELERA COSTA DORADA 1',
        'CARTELERA COSTA DORADA 3',
        'CARTELERA COSTA DORADA 4',
        'CARTELERA COSTA DORADA 5',
        'CARTELERA CRISTO POR CALAFIA',
        'CARTELERA CUAUHTEMOC',
        'CARTELERA CUCAPAH',
        'CARTELERA CUOTA 1 COSTA DORADA',
        'CARTELERA CUOTA ROS-ENS VILLA TOSCANA',
        'CARTELERA CUOTA TKT',
        'CARTELERA DOBLE ESCÉNICA',
        'CARTELERA EL CHAPARRAL',
        'CARTELERA EL CHAPARRAL 2',
        'CARTELERA ENTRADA A PLAYAS',
        'CARTELERA ENTRADA PLAYAS',
        'CARTELERA ESCENICA PLAYAS-ROS',
        'CARTELERA ESCENICA ROSARITO ENS',
        'CARTELERA GARITA CHAPARRAL',
        'CARTELERA GARITA DE OTAY 1',
        'CARTELERA GARITA DE OTAY 2',
        'CARTELERA INTERNACIONAL 2',
        'CARTELERA LAGUNA SALADA',
        'CARTELERA LIBRE ESCENICA ENSENADA',
        'CARTELERA LIBRE ROSARITO 1',
        'CARTELERA LIBRE ROSARITO 2',
        'CARTELERA LIBRE ROSARITO 3',
        'CARTELERA LINEA 3',
        'CARTELERA LINEA CIELO 1',
        'CARTELERA MUJER INVERPLUS',
        'CARTELERA NODO OTAY',
        'CARTELERA PABELLON ROSARITO',
        'CARTELERA PANAMERICANO',
        'CARTELERA PLAZA GALERIAS',
        'CARTELERA PLAZA INFINITI',
        'CARTELERA PRIMOTAPIA-ARENALES',
        'CARTELERA PUENTE REAL INN',
        'CARTELERA READY LANE',
        'CARTELERA READY LANE 2',
        'CARTELERA READY LANE 5',
        'CARTELERA REAL DE SANTA FE',
        'CARTELERA SAHARA',
        'CARTELERA SAN PEDRO',
        'CARTELERA SIMSA',
        'CARTELERA SUBIDA AEROPUERTO',
        'CARTELERA TERAN TERAN MEXICALI',
        'CARTELERA UBICACIÓN VILLA TOSCANA',
        'CARTELERA UNIPOLAR CHICO ROSARITO',
        'CARTELERA UNIPOLAR CUOTA PLAYAS DE TIJ- RTO',
        'CARTELERA UNIPOLAR ENTRADA TIJ',
        'CARTELERA VISTAS DEL RIO 1',
        'CASA DE PIEDRA',
        'CASETA MISIÓN GUADALUPE',
        'CHAT FB',
        'CIELO OFICINAS',
        'CIELO RESIDENCIAL VALLAS',
        'CONTENEDOR 1 PASEO LAS BRISAS',
        'CONTENEDOR 2 PASEO LAS BRISAS',
        'CONTENEDOR ALAMAR',
        'CONTENEDOR BETHEL',
        'CONTENEDOR CANTAMAR',
        'CONTENEDOR CASA DE PIEDRA',
        'CONTENEDOR CIELO 2',
        'CONTENEDOR COSTA DORADA 1',
        'CONTENEDOR COSTA DORADA 3',
        'CONTENEDOR LA FONDA',
        'CONTENEDOR LA PALOMA',
        'CONTENEDOR LOMAS DEL VALLE',
        'CONTENEDOR MISIÓN GUADALUPE',
        'CONTENEDOR PARAISO LADRILLERA',
        'CONTENEDOR POPOTLA',
        'CONTENEDOR PUERTO NUEVO',
        'CONTENEDOR RANCHO LA PUERTA',
        'CONTENEDOR REAL DE SANTA FE',
        'CONTENEDOR REAL DE SANTA FE 1',
        'CONTENEDOR SAHARA',
        'CONTENEDOR SAHARA 2',
        'CONTENEDOR SANTA FE LA PAJARITA',
        'CONTENEDOR SANTA FE TOOGINOS',
        'CONTENEDOR SEVEN ELEVEN',
        'CONTENEDOR TARAY',
        'CONTENEDOR TERAN TERAN',
        'CONTENEDOR VALLE DE GUADALUPE',
        'CONTENEDOR VALLE DEL CIMARRON 1',
        'CONTENEDOR VALLE DEL CIMARRON 2',
        'CONTROL REMOTO LA INVASORA 94.5',
        'CONTROL REMOTO PULSAR',
        'DESARROLLO VISTAS DEL RIO',
        'DESAYUNOS MUJER INVERPLUS',
        'EL SHOW DE MARIO ALBERTO',
        'EL TRIANGULO VALLE DE GUADALUPE',
        'EMPODERATE LA',
        'ENCUESTAS',
        'ENCUESTAS CALLE TIJUANA',
        'ENCUESTAS LINEA OTAY',
        'ENCUESTAS MEXICALI',
        'ENCUESTAS SAN YSIDRO',
        'ENSENADA VILLA MARINA',
        'ENTREVISTA GUSTAVO VARGAS',
        'ENTREVISTA TV AZTECA',
        'ENTREVISTAS RADIO LOS ANGELES',
        'ENTREVISTAS TELEVISA',
        'ENVIOS MASIVOS',
        'EVENTO FATO',
        'EVENTO SENIOR EXPO ONTARIO CA',
        'EXA FM',
        'EXPO ARTE Y DECO ROSARITO 2019',
        'EXPO BODA 2020',
        'EXPO MUEBLE',
        'FACEBOOK AGENTES',
        'FACEBOOK ALAMAR',
        'FACEBOOK ALFREDO ALVAREZ',
        'FACEBOOK BETHEL',
        'FACEBOOK COSTA DORADA',
        'FACEBOOK EMPRESA',
        'FACEBOOK GRUPO CONCORDIA USA',
        'FACEBOOK SAHARA',
        'FACEBOOK TARAY',
        'FACEBOOK VILLA PARAISO',
        'FACEBOOK VILLATOSCANA',
        'FACEBOOK VISTAS DEL RIO',
        'FB AGENTE 1',
        'FB AGENTE 10',
        'FB AGENTE 11',
        'FB AGENTE 12',
        'FB AGENTE 13',
        'FB AGENTE 14',
        'FB AGENTE 15',
        'FB AGENTE 16',
        'FB AGENTE 17',
        'FB AGENTE 18',
        'FB AGENTE 19',
        'FB AGENTE 2',
        'FB AGENTE 20',
        'FB AGENTE 21',
        'FB AGENTE 22',
        'FB AGENTE 23',
        'FB AGENTE 24',
        'FB AGENTE 25',
        'FB AGENTE 26',
        'FB AGENTE 27',
        'FB AGENTE 28',
        'FB AGENTE 3',
        'FB AGENTE 4',
        'FB AGENTE 5',
        'FB AGENTE 6',
        'FB AGENTE 7',
        'FB AGENTE 8',
        'FB AGENTE 9',
        'FLYERS TABLOIDES TOSCANA',
        'FLYERS / TABLOIDES CIELO',
        'FLYERS / TABLOIDES VILLA GLORIA',
        'FLYERS LINEA',
        'FLYERS LOS ANGELES',
        'GIGANTOGRAFIA SENTRI',
        'HOSPITAL ÁNGELES',
        'INFOMERCIAL AZTECA LA',
        'INFOMERCIAL CANAL 22',
        'INFOMERCIAL ESTRELLA TV',
        'INFOMERCIAL TELEMUNDO LOS ANGELES',
        'INFOMERCIAL TELEMUNDO SAN DIEGO',
        'INFOMERCIAL TELEVISA GUADALAJARA',
        'INFOMERCIAL TELEVISA MEXICALI',
        'INFOMERCIAL TELEVISA MONTERREY',
        'INFOMERCIAL TELEVISA TIJUANA',
        'INFOMERCIAL TV AZTECA',
        'INFOMERCIAL UNIVISION LA',
        'LA BUENA EL MALO Y EL FEO',
        'LA MEJOR 90.7',
        'LA OPINION',
        'LA PUERTA',
        'LA QUE BUENA LA',
        'LA RAZA LA',
        'LA TIMES',
        'LINEA 1',
        'LINEA 2',
        'LINEA 4',
        'LLAMADA EN FRIO',
        'LOS ANGELES MIXER 2019',
        'LOS PANCHOS',
        'MARQUESINA SENTRI',
        'Memorial Day Facebook',
        'MENCIÓN LA RANCHERA',
        'MERCADO DE ABASTOS',
        'MUJER INVERPLUS',
        'MURO PLAZA CALIFORNIA',
        'NOCHES DE INVERSIÓN CAZZAR',
        'OFICINA ALAMAR',
        'OFICINA ALTIPLANO',
        'OFICINA BETHEL',
        'OFICINA CAZZAR',
        'OFICINA LOS ANGELES',
        'OFICINA PLAYAS',
        'OFICINA PUERTO NUEVO',
        'OFICINA SENDEROS ROSARITO',
        'OFICINAS LINEA',
        'PAGINA WEB CIELO',
        'PAGINA WEB GRUPO CONCORDIA',
        'PAGINA WEB TECATE',
        'PAGINA WEB TOSCANA',
        'PANTALLA CESPT',
        'PANTALLA CHAPARRAL',
        'PANTALLA HOTEL CORONA',
        'PANTALLA OTAY',
        'PANTALLA PLAZA FIESTA',
        'PANTALLA REAL INN',
        'PANTALLA TV AZTECA',
        'PERIODICO FRONTERA',
        'PLAN DE RECOMPENSA',
        'PONOSA VALLAS CIELO',
        'PONOSA VALLAS PARAÍSO',
        'PROMOCIÓN 40',
        'PROMOTORES VIRTUALES',
        'PROSPECTADORES GARITA',
        'PUENTE BUENA VISTA',
        'PUENTE PLAYAS',
        'PUERTO NUEVO',
        'PUNTO DE VENTA ALAMAR',
        'PUNTO DE VENTA BELLA VISTA',
        'PUNTO DE VENTA BRISAS',
        'PUNTO DE VENTA CASA KEPLER',
        'PUNTO DE VENTA CIMARRÓN',
        'PUNTO DE VENTA LA GLORIA',
        'PUNTO DE VENTA MERCADO HIDALGO',
        'PUNTO DE VENTA PONOSA',
        'RADIO GUSTAVO VARGAS',
        'RADIO LATINA',
        'READY LANE 3',
        'READY LANE 4',
        'REPORTE DE GARITAS',
        'SABOR A VALLE 28',
        'SABOR A VALLE 29',
        'SENTRI',
        'SPOT CNR',
        'SPOT TELEVISA',
        'SPOT TELEVISA 6:00 PM',
        'SPOT TELEVISA 8:00 PM',
        'SPOT TV AZTECA',
        'SPOT TV AZTECA 10:00 AM',
        'SPOT TV AZTECA 8:30 PM',
        'SUCCESSFUL AGING EXPO 2019',
        'TAMALE FESTIVAL',
        'TECATE LOS ENCINOS',
        'TECATE PFC',
        'TELEVISA TIJUANA',
        'TORNEO DE GOLF REAL DEL MAR 2019',
        'TOURS',
        'TV AZTECA SAN DIEGO',
        'UNIDAD DE VENTA',
        'UNIRADIO',
        'UNIRADIO PULSAR',
        'VALLA MOVIL ELEVADA',
        'VALLAS MISIÓN DE GUADALUPE',
        'VALLAS SEVEN ELEVEN',
        'VILLA GLORIA',
        'VILLA GLORIA OFICINAS',
        'VILLA TOSCANA OFICINAS',
        'VIVANUNCIOS',
        'VOLANTE BAJA REAL STATE TOUR',
        'VOLANTE VENTAS',
        'VOLANTES MISION',
        'WEB GPO CONCORDIA USA',
        'WEB MÓVIL SYS',
        'CONTROL EXA 91.7',
        'EXPO MUEBLE 2022',
    ],
    sucursales: [
        "Oficina Cazzar",
        "Oficina Altiplano",
        "Oficina Alamar",
        "Oficina Sainz",
        "Oficina Lomas del Valle",
        "Costa Dorada",
        "Oficina Seven Eleven",
        "Oficina Cielo",
        "Oficina Villa Toscana",
        "Oficina La Gloria",
        "Oficina Sendero",
        "Oficina La Puerta",
        "Oficina Santa Ana",
        "Oficina Los Angeles",
        "Oficina San Ysidro",
        "Oficina Ensenada",
        "Oficina Puerto Nuevo"
    ],
    zonas: [
        "Costa",
        "Costa 1",
        "Costa 2",
        "Costa 3",
        "Costa 4",
        "Oriente",
        "Oficina Centro",
        "Oficina Los Angeles",
        "Oficina Tijuana 2",
        "Oficina Revolucion",
        "Sala de Ventas Cazzar"
    ],
}

export default dataList