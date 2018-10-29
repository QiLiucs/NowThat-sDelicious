import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from "./modules/autocomplete"
import showGoogleMap from "./modules/showGoogleMap"
import typeAhead from "./modules/typeAhead"
import axiosheart from "./modules/heart"

autocomplete($('#address'),$("#lat"),$("#lng"))
showGoogleMap($('#single__gmap'),$('#storeLat'),$('#storeLng'))
typeAhead($(".search"))

const heartForms=$$("form.heart")
heartForms.on("submit",axiosheart)
