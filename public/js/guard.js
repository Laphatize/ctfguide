

    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location.href = "../../login?returnTo=" + window.location.href

        }
    });