module.exports = class Data1649860903771 {
  name = 'Data1649860903771'

  async up(db) {
    await db.query(`CREATE TABLE "substrate_staking_validator_account" ("id" character varying NOT NULL, "account" text NOT NULL, "root_account" text NOT NULL, "network" character varying(8) NOT NULL, CONSTRAINT "PK_b40747ba0a477a11a3c09289cb5" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_d8713da8add539391c637c50f9" ON "substrate_staking_validator_account" ("account") `)
    await db.query(`CREATE INDEX "IDX_87aeca1b9add6ffbf80f11d822" ON "substrate_staking_validator_account" ("root_account") `)
    await db.query(`CREATE INDEX "IDX_8085bc5848f186694c7e2358f3" ON "substrate_staking_validator_account" ("network") `)
    await db.query(`CREATE TABLE "substrate_staking_stash_account" ("id" character varying NOT NULL, "account" text NOT NULL, "root_account" text NOT NULL, "network" character varying(8) NOT NULL, CONSTRAINT "PK_53414345f1a3d9bd7702439447e" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_0eee9d5e78d35a8d4e3f24147a" ON "substrate_staking_stash_account" ("account") `)
    await db.query(`CREATE INDEX "IDX_86e65b03008d2a9e8355d074ed" ON "substrate_staking_stash_account" ("root_account") `)
    await db.query(`CREATE INDEX "IDX_ed63989f36a94fb1f453c860f1" ON "substrate_staking_stash_account" ("network") `)
    await db.query(`CREATE TABLE "substrate_staking_action_history" ("id" character varying NOT NULL, "network" character varying(8) NOT NULL, "block_number" numeric NOT NULL, "action" character varying(13) NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "amount" numeric, "nominator_id" character varying, "validator_id" character varying, "stash_id" character varying, CONSTRAINT "PK_96ed286d45530dfeb8fb8b6de8b" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_fc9ddaa83dcebda12d369f7350" ON "substrate_staking_action_history" ("network") `)
    await db.query(`CREATE INDEX "IDX_76786f8ea93139128c8b1c65b9" ON "substrate_staking_action_history" ("action") `)
    await db.query(`CREATE INDEX "IDX_421ba529ff64759e5b6d5cd151" ON "substrate_staking_action_history" ("nominator_id") `)
    await db.query(`CREATE INDEX "IDX_254db6dc476814716519019484" ON "substrate_staking_action_history" ("validator_id") `)
    await db.query(`CREATE INDEX "IDX_f5388f59a33b9360403ceb8e00" ON "substrate_staking_action_history" ("stash_id") `)
    await db.query(`CREATE TABLE "substrate_staking_nominator_account" ("id" character varying NOT NULL, "account" text NOT NULL, "root_account" text NOT NULL, "network" character varying(8) NOT NULL, CONSTRAINT "PK_a336f41c97a8855e054f3497e2c" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_ec84af9b1c9201728107f31fbe" ON "substrate_staking_nominator_account" ("account") `)
    await db.query(`CREATE INDEX "IDX_9f83630ef8e906c9784dc45a77" ON "substrate_staking_nominator_account" ("root_account") `)
    await db.query(`CREATE INDEX "IDX_f2b0f5bc262e227797edeb3c4a" ON "substrate_staking_nominator_account" ("network") `)
    await db.query(`ALTER TABLE "substrate_staking_action_history" ADD CONSTRAINT "FK_421ba529ff64759e5b6d5cd1510" FOREIGN KEY ("nominator_id") REFERENCES "substrate_staking_nominator_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "substrate_staking_action_history" ADD CONSTRAINT "FK_254db6dc4768147165190194841" FOREIGN KEY ("validator_id") REFERENCES "substrate_staking_validator_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "substrate_staking_action_history" ADD CONSTRAINT "FK_f5388f59a33b9360403ceb8e009" FOREIGN KEY ("stash_id") REFERENCES "substrate_staking_stash_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "substrate_staking_validator_account"`)
    await db.query(`DROP INDEX "public"."IDX_d8713da8add539391c637c50f9"`)
    await db.query(`DROP INDEX "public"."IDX_87aeca1b9add6ffbf80f11d822"`)
    await db.query(`DROP INDEX "public"."IDX_8085bc5848f186694c7e2358f3"`)
    await db.query(`DROP TABLE "substrate_staking_stash_account"`)
    await db.query(`DROP INDEX "public"."IDX_0eee9d5e78d35a8d4e3f24147a"`)
    await db.query(`DROP INDEX "public"."IDX_86e65b03008d2a9e8355d074ed"`)
    await db.query(`DROP INDEX "public"."IDX_ed63989f36a94fb1f453c860f1"`)
    await db.query(`DROP TABLE "substrate_staking_action_history"`)
    await db.query(`DROP INDEX "public"."IDX_fc9ddaa83dcebda12d369f7350"`)
    await db.query(`DROP INDEX "public"."IDX_76786f8ea93139128c8b1c65b9"`)
    await db.query(`DROP INDEX "public"."IDX_421ba529ff64759e5b6d5cd151"`)
    await db.query(`DROP INDEX "public"."IDX_254db6dc476814716519019484"`)
    await db.query(`DROP INDEX "public"."IDX_f5388f59a33b9360403ceb8e00"`)
    await db.query(`DROP TABLE "substrate_staking_nominator_account"`)
    await db.query(`DROP INDEX "public"."IDX_ec84af9b1c9201728107f31fbe"`)
    await db.query(`DROP INDEX "public"."IDX_9f83630ef8e906c9784dc45a77"`)
    await db.query(`DROP INDEX "public"."IDX_f2b0f5bc262e227797edeb3c4a"`)
    await db.query(`ALTER TABLE "substrate_staking_action_history" DROP CONSTRAINT "FK_421ba529ff64759e5b6d5cd1510"`)
    await db.query(`ALTER TABLE "substrate_staking_action_history" DROP CONSTRAINT "FK_254db6dc4768147165190194841"`)
    await db.query(`ALTER TABLE "substrate_staking_action_history" DROP CONSTRAINT "FK_f5388f59a33b9360403ceb8e009"`)
  }
}
