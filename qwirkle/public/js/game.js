CopyToClipboard = function (containerid) {
    var range = document.createRange();
    range.selectNode(document.getElementById(containerid));
    window.getSelection().removeAllRanges(range);
    window.getSelection().addRange(range);
    document.execCommand("copy");//method is deprecated need alternative!!!!
    alert("text copied");
}