export default function cepMask(cep) {
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
}