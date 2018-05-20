class Verif {

	static  verif(data, type, len){
		if (data === undefined || data === '' || (data.length > len && len !== 0))
			return false
		if (type === 1) {
			if (isNaN(data) || data < 0 || data > 2147483648)
				return false
		}
		return true
	}
}

module.exports = Verif
