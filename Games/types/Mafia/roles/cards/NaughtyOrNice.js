const Card = require("../../Card");
const { PRIORITY_INVESTIGATIVE_DEFAULT } = require("../../const/Priority");

module.exports = class NaughtyOrNice extends Card {
  constructor(role) {
    super(role);

    this.meetings = {
      "Check List": {
        states: ["Night"],
        flags: ["voting"],
        action: {
          labels: ["investigate", "alignment"],
          priority: PRIORITY_INVESTIGATIVE_DEFAULT,
          run: function () {
            let visitors = this.getVisitors();
            if (visitors.length > 0) {
              return;
            }

            let role = this.target.getAppearance("investigate", true);
            let alignment = this.game.getRoleAlignment(role);
            let naughtyOrNice;
            switch (alignment) {
              case "Village":
              case "Independent":
                naughtyOrNice = "nice";
                break;
              case "Mafia":
              case "Cult":
                naughtyOrNice = "naughty";
                break;
            }

            if (this.actor.hasEffect("FalseMode")) {
              switch (this.target.role.alignment) {
                case "Village":
                case "Independent":
                  naughtyOrNice = "naughty";
                  break;
                case "Mafia":
                case "Cult":
                  naughtyOrNice = "nice";
                  break;
              }
            }

            let alert = `:invest: You learn that ${this.target.name} is ${naughtyOrNice}!`;
            this.game.queueAlert(alert, 0, this.meeting.getPlayers());
          },
        },
      },
    };
  }
};
