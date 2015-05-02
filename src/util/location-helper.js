function LocationHelperFn() {

	return {
		getQueryParameter: function(key, default_) {
			if (default_==null) default_=null;
			key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
			key = key.replace("$","\\$");
			var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
			var qs = regex.exec(window.location.href);
			if(qs == null)
				return default_;
			else
				return qs[1];
		}
	};
}

export var LocationHelper = new LocationHelperFn();
