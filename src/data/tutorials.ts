export interface Tutorial {
  id: string;
  titulo: string;
  categoria: string;
  duracao: string;
  linkYoutube: string;
  thumbnail: string;
  nivel: string;
  descricaoCurta: string;
}

export const tutorials: Tutorial[] = [
  // HIDRÁULICA
  { id: '1', titulo: "Conquiste vazamento de torneira em 47s", categoria: "HIDRÁULICA", duracao: "0:47", linkYoutube: "https://www.youtube.com/watch?v=ghXZC_TwTvY", thumbnail: "https://img.youtube.com/vi/ghXZC_TwTvY/hqdefault.jpg", nivel: "Recruta", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '2', titulo: "Conquiste torneira 1/4 de volta pingando sem gastar nada", categoria: "HIDRÁULICA", duracao: "3:10", linkYoutube: "https://www.youtube.com/watch?v=MsIX9InZiT8", thumbnail: "https://img.youtube.com/vi/MsIX9InZiT8/hqdefault.jpg", nivel: "Recruta", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '3', titulo: "Conquiste torneira que não para de pingar (troca de retentor)", categoria: "HIDRÁULICA", duracao: "4:15", linkYoutube: "https://www.youtube.com/watch?v=aRDLFqaajEc", thumbnail: "https://img.youtube.com/vi/aRDLFqaajEc/hqdefault.jpg", nivel: "Soldado", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '4', titulo: "Conquiste torneira pingando – troca completa de carrapeta", categoria: "HIDRÁULICA", duracao: "2:50", linkYoutube: "https://www.youtube.com/watch?v=g4geRB1vwSI", thumbnail: "https://img.youtube.com/vi/g4geRB1vwSI/hqdefault.jpg", nivel: "Soldado", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '5', titulo: "Conquiste torneira vazando – troca do vedante", categoria: "HIDRÁULICA", duracao: "5:20", linkYoutube: "https://www.youtube.com/watch?v=pnX3C0y7DZs", thumbnail: "https://img.youtube.com/vi/pnX3C0y7DZs/hqdefault.jpg", nivel: "Recruta", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '6', titulo: "Conquiste caixa acoplada vazando (troca da bolsa)", categoria: "HIDRÁULICA", duracao: "6:30", linkYoutube: "https://www.youtube.com/watch?v=PsCJTiLt_ac", thumbnail: "https://img.youtube.com/vi/PsCJTiLt_ac/hqdefault.jpg", nivel: "Viltrumita", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '7', titulo: "Conquiste descarga de caixa acoplada que vaza sem parar", categoria: "HIDRÁULICA", duracao: "4:00", linkYoutube: "https://www.youtube.com/watch?v=zdpv-hePUW8", thumbnail: "https://img.youtube.com/vi/zdpv-hePUW8/hqdefault.jpg", nivel: "Soldado", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '8', titulo: "Conquiste vazamento entre caixa acoplada e vaso", categoria: "HIDRÁULICA", duracao: "7:15", linkYoutube: "https://www.youtube.com/watch?v=BtwrZ0VSIOg", thumbnail: "https://img.youtube.com/vi/BtwrZ0VSIOg/hqdefault.jpg", nivel: "Viltrumita", descricaoCurta: "Viltrumitas não chamam técnico" },

  // ELÉTRICA
  { id: '9', titulo: "Conquiste tomada solta ou queimada em 5 passos", categoria: "ELÉTRICA", duracao: "3:45", linkYoutube: "https://www.youtube.com/watch?v=9NcnOl37IOo", thumbnail: "https://img.youtube.com/vi/9NcnOl37IOo/hqdefault.jpg", nivel: "Recruta", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '10', titulo: "Conquiste troca de tomada simples por dupla", categoria: "ELÉTRICA", duracao: "5:10", linkYoutube: "https://www.youtube.com/watch?v=_N9lH8309bs", thumbnail: "https://img.youtube.com/vi/_N9lH8309bs/hqdefault.jpg", nivel: "Soldado", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '11', titulo: "Conquiste tomada antiga por padrão brasileiro novo", categoria: "ELÉTRICA", duracao: "6:05", linkYoutube: "https://www.youtube.com/watch?v=P674E1WO6AE", thumbnail: "https://img.youtube.com/vi/P674E1WO6AE/hqdefault.jpg", nivel: "Viltrumita", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '12', titulo: "Conquiste qualquer chuveiro queimado (3 segredos)", categoria: "ELÉTRICA", duracao: "8:20", linkYoutube: "https://www.youtube.com/watch?v=hNr20-DkKQk", thumbnail: "https://img.youtube.com/vi/hNr20-DkKQk/hqdefault.jpg", nivel: "Thragg", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '13', titulo: "Conquiste troca de resistência de chuveiro queimado", categoria: "ELÉTRICA", duracao: "4:30", linkYoutube: "https://www.youtube.com/watch?v=dpQFU1k4piU", thumbnail: "https://img.youtube.com/vi/dpQFU1k4piU/hqdefault.jpg", nivel: "Soldado", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '14', titulo: "Conquiste chuveiro que não funciona (diagnóstico rápido)", categoria: "ELÉTRICA", duracao: "3:15", linkYoutube: "https://www.youtube.com/watch?v=M6VY4uY5OLw", thumbnail: "https://img.youtube.com/vi/M6VY4uY5OLw/hqdefault.jpg", nivel: "Recruta", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '15', titulo: "Conquiste tomada com mau contato ou curto-circuito", categoria: "ELÉTRICA", duracao: "5:50", linkYoutube: "https://www.youtube.com/watch?v=lmVljb7DYz0", thumbnail: "https://img.youtube.com/vi/lmVljb7DYz0/hqdefault.jpg", nivel: "Viltrumita", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '16', titulo: "Conquiste troca de interruptor simples ou duplo", categoria: "ELÉTRICA", duracao: "4:05", linkYoutube: "https://www.youtube.com/watch?v=9NcnOl37IOo", thumbnail: "https://img.youtube.com/vi/9NcnOl37IOo/hqdefault.jpg", nivel: "Soldado", descricaoCurta: "Viltrumitas não chamam técnico" },

  // ESTRUTURAL
  { id: '17', titulo: "Conquiste furo na parede de drywall em 1 minuto", categoria: "ESTRUTURAL", duracao: "1:00", linkYoutube: "https://www.youtube.com/watch?v=NOkj9YpQt3c", thumbnail: "https://img.youtube.com/vi/NOkj9YpQt3c/hqdefault.jpg", nivel: "Recruta", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '18', titulo: "Conquiste buraco grande no gesso ou drywall", categoria: "ESTRUTURAL", duracao: "7:40", linkYoutube: "https://www.youtube.com/watch?v=CG2tIhHEDCs", thumbnail: "https://img.youtube.com/vi/CG2tIhHEDCs/hqdefault.jpg", nivel: "Soldado", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '19', titulo: "Conquiste trinca ou rachadura na parede de gesso", categoria: "ESTRUTURAL", duracao: "5:30", linkYoutube: "https://www.youtube.com/watch?v=qq2ZN5Vw2zc", thumbnail: "https://img.youtube.com/vi/qq2ZN5Vw2zc/hqdefault.jpg", nivel: "Viltrumita", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '20', titulo: "Conquiste buraco na parede com massa corrida rápida", categoria: "ESTRUTURAL", duracao: "2:45", linkYoutube: "https://www.youtube.com/watch?v=3JVguSqZY0E", thumbnail: "https://img.youtube.com/vi/3JVguSqZY0E/hqdefault.jpg", nivel: "Recruta", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '21', titulo: "Conquiste buraco no forro de gesso drywall", categoria: "ESTRUTURAL", duracao: "6:15", linkYoutube: "https://www.youtube.com/watch?v=TR5tMtlR9qI", thumbnail: "https://img.youtube.com/vi/TR5tMtlR9qI/hqdefault.jpg", nivel: "Soldado", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '22', titulo: "Conquiste reparo invisível em parede de drywall", categoria: "ESTRUTURAL", duracao: "8:00", linkYoutube: "https://www.youtube.com/watch?v=NOkj9YpQt3c", thumbnail: "https://img.youtube.com/vi/NOkj9YpQt3c/hqdefault.jpg", nivel: "Viltrumita", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '23', titulo: "Conquiste fixar prateleira na parede de gesso sem cair", categoria: "ESTRUTURAL", duracao: "9:20", linkYoutube: "https://www.youtube.com/watch?v=3JVguSqZY0E", thumbnail: "https://img.youtube.com/vi/3JVguSqZY0E/hqdefault.jpg", nivel: "Thragg", descricaoCurta: "Viltrumitas não chamam técnico" },

  // MECÂNICA
  { id: '24', titulo: "Conquiste microondas que parou de funcionar", categoria: "MECÂNICA", duracao: "10:15", linkYoutube: "https://www.youtube.com/watch?v=lQzccnzDDz4", thumbnail: "https://img.youtube.com/vi/lQzccnzDDz4/hqdefault.jpg", nivel: "Recruta", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '25', titulo: "Conquiste geladeira que não gela (diagnóstico completo)", categoria: "MECÂNICA", duracao: "12:30", linkYoutube: "https://www.youtube.com/watch?v=v-FWZaeFnTQ", thumbnail: "https://img.youtube.com/vi/v-FWZaeFnTQ/hqdefault.jpg", nivel: "Viltrumita", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '26', titulo: "Conquiste conserto de geladeira para iniciantes", categoria: "MECÂNICA", duracao: "8:45", linkYoutube: "https://www.youtube.com/watch?v=p58pc-1ASB8", thumbnail: "https://img.youtube.com/vi/p58pc-1ASB8/hqdefault.jpg", nivel: "Soldado", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '27', titulo: "Conquiste porta de microondas quebrada ou mola frouxa", categoria: "MECÂNICA", duracao: "6:50", linkYoutube: "https://www.youtube.com/watch?v=lQzccnzDDz4", thumbnail: "https://img.youtube.com/vi/lQzccnzDDz4/hqdefault.jpg", nivel: "Recruta", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '28', titulo: "Conquiste geladeira vazando água ou com gelo excessivo", categoria: "MECÂNICA", duracao: "11:20", linkYoutube: "https://www.youtube.com/watch?v=v-FWZaeFnTQ", thumbnail: "https://img.youtube.com/vi/v-FWZaeFnTQ/hqdefault.jpg", nivel: "Thragg", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '29', titulo: "Conquiste manutenção preventiva de eletrodomésticos", categoria: "MECÂNICA", duracao: "9:00", linkYoutube: "https://www.youtube.com/watch?v=lQzccnzDDz4", thumbnail: "https://img.youtube.com/vi/lQzccnzDDz4/hqdefault.jpg", nivel: "Recruta", descricaoCurta: "Viltrumitas não chamam técnico" },
  { id: '30', titulo: "Conquiste microondas barulhento ou com faísca", categoria: "MECÂNICA", duracao: "7:35", linkYoutube: "https://www.youtube.com/watch?v=lQzccnzDDz4", thumbnail: "https://img.youtube.com/vi/lQzccnzDDz4/hqdefault.jpg", nivel: "Soldado", descricaoCurta: "Viltrumitas não chamam técnico" }
];
