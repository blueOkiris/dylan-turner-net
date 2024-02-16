// Author(s): Dylan Turner <dylan.turner@tutanota.com>
// Implement project carousel scroll

class Project {
    constructor(title, id, imgSrc, lines) {
        this.title = title;
        this.id = id;
        this.imgSrc = imgSrc;
        this.lines = lines;
    }
}

function main() {
    window.addEventListener(
        'scroll',
        () => {
            document.body.style.setProperty(
                '--scroll',
                window.pageYOffset / (document.body.offsetHeight - window.innerHeight)
            );
        }, false
    );

    // Parse project content
    let req = new XMLHttpRequest();
    let success = 0;
    while (success != 200) {
        req.open('GET', 'projs.txt', false);
        req.send();
        success = req.status;
    }
    let projTxts = req.responseText.split('\n#$#\n');
    let projs = [];
    for (let projTxt of projTxts) {
        let lines = projTxt.split('\n');
        projs.push(new Project(lines[0], lines[1], lines[2], lines.slice(3)));
    }

    // Have the CSS animations adjust based on len
    let invisible = 'opacity: 0; top: -300px; left: -300px;';
    let visible = 'opacity: 100; top: 80px; left: 20px;';
    let txtInvis = 'opacity: 0; bottom: -300px; right: -300px;'
    let txtVis = 'opacity: 100; bottom: 100px; right: 22px;';
    let spacing = 100.0 / projs.length;
    let styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);
    for (let i = 0; i < projs.length; i++) {
        let proj = projs[i];
        let imgRule =
            '@keyframes ' + proj.id + ' {\n'
                + (i == 0 ?
                    '\t0% { opacity: 100; top: 360px; left: 18px }\n' :
                    '\t0% { ' + invisible + ' }\n')
                + (i == 0 ? '' : '\t' + (i * spacing).toString() + '% { ' + invisible + ' }\n')
                + '\t' + (i * spacing + 5).toString() + '% { ' + visible + ' }\n'
                + '\t' + ((i + 1) * spacing - 5).toString() + '% { ' + visible + ' }\n'
                + (i != projs.length - 1 ?
                    '\t' + ((i + 1) * spacing + 5).toString() + '% { ' + invisible + ' }\n'
                    : '')
                + '\t100% { ' + (i != projs.length - 1 ? invisible : visible) + ' }\n'
                + '}\n';
        styleSheet.sheet.insertRule(imgRule, styleSheet.sheet.cssRules.length);
        let txtRule =
            '@keyframes ' + proj.id + '_blurb {\n'
                + (i == 0 ?
                    '\t0% { opacity: 100; bottom: 120px; right: 22px }\n' :
                    '\t0% { ' + txtInvis + ' }\n')
                + (i == 0 ? '' : '\t' + (i * spacing).toString() + '% { ' + txtInvis + ' }\n')
                + '\t' + (i * spacing + 5).toString() + '% { ' + txtVis + ' }\n'
                + '\t' + ((i + 1) * spacing - 5).toString() + '% { ' + txtVis + ' }\n'
                + (i != projs.length - 1 ?
                    '\t' + ((i + 1) * spacing + 5).toString() + '% { ' + txtInvis + ' }\n'
                    : '')
                + '\t100% { ' + (i != projs.length - 1 ? txtInvis : txtVis) + ' }\n'
                + '}\n';
        styleSheet.sheet.insertRule(txtRule, styleSheet.sheet.cssRules.length);
    }

    // Create images for each project
    for (let proj of projs) {
        let img = document.createElement('img');
        img.src = proj.imgSrc;
        let projImg = document.createElement('div');
        projImg.id = proj.id;
        projImg.className = 'proj-img';

        projImg.style.animation = proj.id + ' 1s ease-in-out';
        projImg.style.animationPlayState = 'paused';
        projImg.style.animationDelay = 'calc(var(--scroll) * -1s)';
        projImg.style.animationIterationCount = '1';
        projImg.style.animationFillMode = 'both';

        projImg.appendChild(img);
        document.body.appendChild(projImg);
    }

    // Create text blurbs for each project
    for (let proj of projs) {
        let blurb = document.createElement('div');
        blurb.className = 'proj-blurb';
        blurb.id = proj.id + '_blurb';

        let title = document.createElement('h3');
        title.innerText = proj.title;
        blurb.appendChild(title);
        for (let line of proj.lines.slice(0, -1)) {
            let p = document.createElement('p');
            p.innerText = line;
            blurb.appendChild(p);
        }
        let a = document.createElement('a');
        a.innerText = 'READ MORE HERE';
        a.href = proj.lines[proj.lines.length - 1];
        blurb.appendChild(a);

        blurb.style.animation = proj.id + '_blurb 1s ease-in-out';
        blurb.style.animationPlayState = 'paused';
        blurb.style.animationDelay = 'calc(var(--scroll) * -1s)';
        blurb.style.animationIterationCount = '1';
        blurb.style.animationFillMode = 'both';

        document.body.appendChild(blurb);
    }

    // Add a bunch of <br> to make the site actually be scrollable
    // since we're using position: fixed
    for (let i = 0; i < 100 * projs.length; i++) {
        document.body.appendChild(document.createElement('br'));
    }
}

