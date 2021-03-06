import { BaseDao } from "../../../DAO/baseDao";
import { MemberProps } from "../common/MemberProps";

const pgp = require("pg-promise");

export class MemberDao extends BaseDao {
  private static instance: MemberDao;

  constructor() {
    super();
  }

  public static getInstance(): MemberDao {
    if (!MemberDao.instance) {
      console.log("Creating MemberDao Instance...");
      MemberDao.instance = new MemberDao();
    }

    return MemberDao.instance;
  }

  public selectAllMember(callback: Function) {
    const q = `SELECT * FROM "Member"`;
    const client = this.getClient();

    let data = Array();

    client.query(q, async (err, result) => {
      if (err) {
        console.log("Can't exec query!" + err);
      }
      const list = result.rows;

      client.end();

      for (var i = 0; i < list.length; i++) {
        let newMember: MemberProps = {
          member_no: list[i].member_no,
          name: list[i].name,
          password: list[i].password,
          recommender: list[i].recommender,
        };
        data.push(newMember);
      }

      callback(data);
    });
  }

  public selectMember(member: MemberProps, callback: Function) {
    const q = `SELECT * FROM "Member" where member_no=$1 and password=$2`;
    const client = this.getClient();

    console.log(pgp.as.format(q, [member.member_no, member.password]));
    client.query(q, [member.member_no, member.password], (err, result) => {
      client.end();
      console.log();

      if (err) {
        console.log("Can't exec query!" + err);
        callback(null, err);
        return;
      }

      if (result.rowCount != 0) {
        callback(result.rows[0], null);
      } else {
        callback(null, null);
      }
    });
  }

  public selectMemberByNo(no: String, callback: Function) {
    const q = `SELECT * FROM "Member" where member_no = $1`;
    const client = this.getClient();

    client.query(q, [no], (err, result) => {
      client.end();

      if (err) {
        console.log("Can't exec query!" + err);
        callback(null, err);
        return;
      }

      if (result.rowCount != 0) {
        callback(result.rows[0], null);
      } else {
        callback(null, null);
      }
    });
  }

  public insertMember(member: MemberProps, callback: Function) {
    const q = `INSERT INTO "Member"(member_no, name, password, recommender, point) values ($1, $2, $3, $4, '0')`;
    const client = this.getClient();
    const giveQ = `UPDATE "Member" SET point = point + '10000' WHERE member_no = $1`;

    if (member.recommender != undefined) {
      console.log("recommnder", member.recommender);
      client.query(giveQ, [member.recommender], (err, result) => {
        if (err) {
          console.log("Can't exec query! When add recommender" + err);
        }
      });
    }

    client.query(
      q,
      [member.member_no, member.name, member.password, member.recommender],
      (err, result) => {
        if (err) {
          console.log("Can't exec query!" + err);
          callback(null, err);
          return;
        }

        client.end();
        this.selectMember(member, callback);
      }
    );
  }
}
