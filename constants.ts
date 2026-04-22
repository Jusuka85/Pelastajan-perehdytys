
import { Section, OrganizationSettings } from './types';

export const DEFAULT_INTRO_TEXT = "Pelastajan perehdytys alkaa yleistyöajassa viiden päivän ajan. Kaksi työvuoroa (24h) pilkotaan tunneiksi seuraavasti: 3 pv x 8h ja 2 pv x 12h, jonka jälkeen pelastaja siirtyy omaan työvuoroonsa ja perehdytys jatkuu siellä seuraavan kahden kuukauden ajan.";

export const DEFAULT_ORG_SETTINGS: OrganizationSettings = {
  name: "Satakunnan hyvinvointialue",
  subtitle: "Pelastustoimi",
  city: "Porissa"
};

export const SECTIONS: Section[] = [
  {
    id: 'day1',
    title: 'Päivä 1 (8h), Kanta-Porin paloasema',
    subtitle: '(asemamestarit + heto)',
    items: [
      { id: 'd1_hallinto', label: 'Hallinnolliset asiat' },
      { id: 'd1_org', label: 'Organisaatioesittely' },
      { id: 'd1_hr', label: 'HR-asiat' },
      { id: 'd1_palkka', label: 'Palkkaus' },
      { id: 'd1_tyoaika', label: 'Työaika' },
      { id: 'd1_terveys', label: 'Työterveys' },
      { id: 'd1_sairaus', label: 'Sairauslomat' },
      { id: 'd1_seuranta', label: 'Työajan seuranta (Visma Numeron)' },
      { id: 'd1_tunnukset', label: 'Tunnukset ja järjestelmät (sähköposti, Numeron, SafetyPass)' },
      { id: 'd1_varusteet', label: 'Varusteet' },
      { id: 'd1_avaimet', label: 'Avaimet' },
      { id: 'd1_kortti', label: 'Virkakortti' },
      { id: 'd1_palvelu', label: 'Asemapalvelu/päiväpalvelusohjelma' },
    ]
  },
  {
    id: 'day2',
    title: 'Päivä 2 (8h), Turvallisuuskeskus',
    items: [
      { id: 'd2_savu', label: 'Kylmä ja kuuma savusukellus → huolto' },
      { id: 'd2_tie', label: 'Tieliikennepelastaminen' },
      { id: 'd2_hydrauli', label: 'Hydrauliset pelastusvälineet' },
      { id: 'd2_taktiikka', label: 'Taktiset toimintamallit' },
      { id: 'd2_harjoittelu', label: 'Käytännön harjoittelu' },
    ]
  },
  {
    id: 'day3',
    title: 'Päivä 3 (8h), Turvallisuuskeskus',
    items: [
      { id: 'd3_aineet', label: 'Vaaralliset aineet' },
      { id: 'd3_kemi', label: 'Kemikaalisukellus' },
      { id: 'd3_puvut', label: 'Puvut' },
      { id: 'd3_pvat', label: 'PVAT' },
    ]
  },
  {
    id: 'day4',
    title: 'Päivä 4 (12h), Kanta-Porin/Rauman paloasema',
    subtitle: '(vuoropäivinä), (valmistuneet pelastajat)',
    items: [
      { id: 'd4_ensihoito', label: 'Ensihoidon perehdytys (ensihoito vastaa perehdytyksestä oman perehdytysohjelmansa mukaan)' },
    ]
  },
  {
    id: 'day5',
    title: 'Päivä 5 (12h), Kanta-Porin/Rauman paloasema',
    subtitle: '(vuoropäivinä), (valmistuneet pelastajat)',
    items: [
      { id: 'd5_ensihoito', label: 'Ensihoidon perehdytys (ensihoito vastaa perehdytyksestä oman perehdytysohjelmansa mukaan)' },
    ]
  },
  {
    id: 'vuoro_yleinen',
    title: 'Perehdytys työvuorossa (2 kk)',
    subtitle: 'Yleiset taidot ja pelastustehtävät',
    items: [
      { id: 'v_pinta', label: 'Pintapelastus' },
      { id: 'v_virta', label: 'Pintapelastus virtaavassa vedessä' },
      { id: 'v_ajo', label: 'Ajoharjoittelu, taitoradat' },
      { id: 'v_virve', label: 'Virven peruskäyttö ja kansiorakenne (Satakunta)' },
    ]
  },
  {
    id: 'vuoro_kalusto',
    title: 'Kalusto',
    items: [
      { id: 'k_akku', label: 'Akkukoneet ja niiden käyttö' },
      { id: 'k_liinat', label: 'Kuormaliinojen käyttö' },
      { id: 'k_sahat', label: 'Moottorisahat ja niiden huolto' },
      { id: 'k_lukko', label: 'Lukkopora' },
      { id: 'k_tyynyt', label: 'Nostotyynyt' },
      { id: 'k_puukko', label: 'Puukkosaha / terän vaihto' },
      { id: 'k_pvat', label: 'Aluekohtainen PVAT-kalusto' },
      { id: 'k_tuuletin', label: 'Savutuuletin / sukan käyttö' },
      { id: 'k_mittarit', label: 'Kaikki mittarit, niiden käyttö' },
      { id: 'k_luoti', label: 'Luotisahan käyttö/huolto' },
      { id: 'k_rallakka', label: 'Rälläkkä, pieni ja iso/laikan vaihto' },
      { id: 'k_taljat', label: 'Vaijeritaljan/ketjutaljan/lompakkotaljan käyttö + väkipyörät' },
    ]
  },
  {
    id: 'vuoro_ajoneuvo',
    title: 'Ajoneuvokalusto',
    items: [
      { id: 'a_kontti', label: 'Kontin poisto ja takaisin laitto' },
      { id: 'a_tankkaus', label: 'Ajoneuvojen tankkaaminen' },
      { id: 'a_pumppu', label: 'Hydrauliikkapumpun käyttö' },
      { id: 'a_vinssi', label: 'Vinssi' },
      { id: 'a_genu', label: 'Generaattori' },
      { id: 'a_aamu', label: 'Aamutarkastukset' },
      { id: 'a_viikko', label: 'Viikkotarkastukset' },
      { id: 'a_mekaaninen', label: 'Pumpun käyttö / pumpun mekaaninen käyttö' },
      { id: 'a_muu', label: 'Muu ajoneuvon pienkalusto' },
      { id: 'a_pi', label: 'PI-pullot tyhjät/täydet, merkintäkäytäntö' },
    ]
  },
  {
    id: 'vuoro_vene',
    title: 'Venekalusto',
    items: [
      { id: 've_ajo', label: 'Ajoharjoittelu' },
      { id: 've_lasku', label: 'Veneen lasku trailerilla' },
      { id: 've_nosto', label: 'Veneen ajo trailerille' },
      { id: 've_peruutus', label: 'Peruuttaminen trailerin kanssa, hööki/lava-auto' },
    ]
  },
  {
    id: 'vuoro_monkija',
    title: 'Mönkijä',
    items: [
      { id: 'm_ajo', label: 'Ajoharjoittelu' },
      { id: 'm_karry', label: 'Kärrylle ajaminen ja kärryltä poistaminen' },
    ]
  },
  {
    id: 'vuoro_nostolava',
    title: 'Nostolava-auto',
    items: [
      { id: 'n_petaus', label: 'Petaaminen' },
      { id: 'n_apu', label: 'Avustavat työt' },
      { id: 'n_poistu', label: 'Hätäpoistuminen' },
    ]
  },
  {
    id: 'muut',
    title: 'Muut järjestelmät ja prosessit',
    items: [
      { id: 'm_paine', label: 'Paineilmalaitehuolto' },
      { id: 'm_malli', label: 'Satakunnan pelastuslaitoksen toimintamallit' },
      { id: 'm_tilat', label: 'Paloaseman tilojen esittely' },
      { id: 'm_moodle', label: 'Hyvinvointialueen yleinen perehdytys (moodle)' },
      { id: 'm_tieto', label: 'Tietoturvatentti' },
      { id: 'm_num', label: 'Numeron: Vuoronvaihdot, Ylityöt, Asemasiirrot' },
      { id: 'm_km', label: 'Kilometrikorvaukset' },
      { id: 'm_merlot', label: 'Merlot' },
      { id: 'm_ess', label: 'ESS: Vuosilomat, Sairauslomat, Muut poissaolot' },
      { id: 'm_oss', label: 'OSS: Koulutukset, Kehityskeskustelut' },
      { id: 'm_pass', label: 'SafetyPass' },
      { id: 'm_tuve', label: 'Tuve' },
      { id: 'm_ts', label: 'Työsuojelu' },
      { id: 'm_haipro', label: 'HaiPro' },
    ]
  }
];
