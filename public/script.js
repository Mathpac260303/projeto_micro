async function refresh() {
    try {
        const res = await fetch("/data");
        const data = await res.json();

        document.getElementById("s1").textContent = data.s1;
        document.getElementById("s2").textContent = data.s2;
        document.getElementById("s3").textContent = data.s3;
        document.getElementById("s4").textContent = data.s4;
        document.getElementById("s5").textContent = data.s5;
    } catch (err) {
        console.log("Error fetching data:", err);
    }
}

// run immediately and every 1 second
refresh();
setInterval(refresh, 1000);