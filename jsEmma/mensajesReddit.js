module.exports.redditMensajes = async function(message,extra){
    const redditFetch = require("reddit-fetch");
    if (extra){
        redditFetch({
            subreddit: "hentai",
            sort: "nsfw",
            allowNSFW: true,
            allowModPost: true,
            allowCrossPost: true,
            allowVideo: true
        }).then(post => {
          message.channel.send(`Que esto quede entre nosotros ;) ${message.author},aca esta tu post llamado `);
          {message.channel.send(`${post.title} ;)`);}
          message.channel.send(`${post.url}`)});
    }
    else{
        redditFetch({
            subreddit: "SpanishMeme",
            sort: "all",
            allowNSFW: true,
            allowModPost: true,
            allowCrossPost: true,
            allowVideo: false
        }).then(post => {
          message.channel.send(`¡${message.author}, acá hay un meme llamado`);
          {message.channel.send(`${post.title} !`);}
          message.channel.send(`${post.url}`)});
    }
}