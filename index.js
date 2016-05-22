'use strict'

const usersAdded = [];
const usersDone = [];

function loadUser(name) {
  console.log(`Loading ${name}...`)
  Promise.all([
    fetch(`https://api-staging.scratch.mit.edu/users/${name}`),
    fetch(`https://api-staging.scratch.mit.edu/users/${name}/following`),
  ])
    .then(res => Promise.all(res.map(r => r.json())))
    .then(([user, followers]) => {
      if (usersDone.includes(user.id)) return;
      usersDone.push(user.id);

      console.log(user)
      const userNode = {id: user.id, label: user.username}
      const followerNodes = followers.map(u => ({id: u.id, label: u.username}))
      const allNodes = [userNode, ...followerNodes]
      const addNodes = allNodes.filter(n => !(usersAdded.includes(n.id)))
      addNodes.forEach(n => {
        usersAdded.push(n.id)
      })
      const connections = followerNodes
        // .filter(n => addNodes.includes(n))
        .map(u => ({from: user.id, to: u.id}))
      nodes.add(addNodes)
      edges.add(connections)
    })
    .catch(err => console.error(err))
}

const nodes = new vis.DataSet([])

const edges = new vis.DataSet([
  {from: 1, to: 3},
  {from: 1, to: 2},
  {from: 2, to: 4},
  {from: 2, to: 5},
])

const container = document.getElementById('network')

const data = {nodes, edges}
const options = {
  edges: {
    arrows: 'to'
  }
}

const network = new vis.Network(container, data, options)

network.addEventListener('click', evt => {
  if (!evt.nodes.length) return

  loadUser(nodes.get(evt.nodes[0]).label)
})

loadUser('liam48D')
