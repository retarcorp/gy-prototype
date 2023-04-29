class Participant {
    
    constructor(name, nickname) {
        this.name = name;
        this.nickname = nickname;
        this.id = (new Date() * (1 + Math.random())).toString(32);
        this.phone = '+3620' + Math.floor(Math.random() * 10000000).toString();
        this.email = nickname + '@gmail.com';
    }
}

const data = [
    ['Denis', 'dencat'],
    ['Ferenc', 'ferenciektere'],
    ['Gyula', 'bestofthebest'],
    ['Jozsef', 'godofdates'],
    ['Kelemen', 'gentleguy'],
    ['László', 'laszlo1995'],
    ['Oszkar', 'moviefan'],
    ['Robi', 'roberto'],
    ['Szabolcs', 'szabi44'],
    ['Zalán', 'thrower'],
    ['Zoltán', 'chieftain'],
    ['Zsolt', 'happilyeverafter'],
    ['Bence', 'bighopes'],
    ['Éliás', 'eliahwood'],
    ['Gergely', 'victorious']
    
].map(([n, nn]) => new Participant(n, nn))

export default data;