const Card = require("../../Card");

module.exports = class GovernmentCore extends Card {
  constructor(role) {
    super(role);

    this.meetings = {
      Government: {
        states: ["*"],
        flags: ["group", "speech"],
        priority: 0,
      },
      "Election Vote": {
        states: ["Election"],
        flags: ["group", "voting"],
        inputType: "custom",
        targets: ["Ja!", "Nein!"],
        priority: 0,
        action: {
          run: function () {
            // TODO account for ties

            // print results
            let votes = {};
            votes["Ja!"] = [];
            votes["Nein!"] = [];
            let electionVoteMeeting =
              this.game.getMeetingByName("Election Vote");
            for (let member of electionVoteMeeting.members) {
              let vote = electionVoteMeeting.votes[member.id];
              if (vote) {
                votes[vote].push(member.player.name);
              }
            }

            for (const v in votes) {
              if (votes[v].length > 0) {
                this.game.queueAlert(`Voted ${v}: ${votes[v].join(", ")}`);
              }
            }

            if (this.target == "Ja!") {
              this.game.approveElection();
            } else {
              this.game.incrementFailedElectionTracker();
            }

            // set specialElection to false
            this.game.specialElection = false;
          },
        },
      },
    };
  }

  seeVote(vote) {
    if (
      vote.meeting.name == "Election Vote" &&
      vote.voter != this.role.player
    ) {
      vote.cancel = true;
    }
  }
};
